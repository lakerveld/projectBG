// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadLocationContent, parseLocationContent } from "./locationContent";
import {
  publicLocation,
  quizReady,
  transition,
  type StoredLocation
} from "@/lib/domain/locationGame";

describe("location content and transitions", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("loads all six real map locations and only enables the completed quiz", async () => {
    const quizzes = await loadLocationContent();
    expect(quizzes).toHaveLength(6);
    expect(quizzes.map((quiz) => quiz.name)).toEqual([
      "Café Rood/Wit",
      "Brouwerij De Koninck",
      "Only Cheese",
      "Den Botaniek",
      "Skins",
      "Petanque bij Escape Room Café"
    ]);
    expect(quizzes[0]).not.toHaveProperty("time");
    expect(quizzes[0].story).toContain("De Verloren Handelsroute");
    expect(quizzes.map(quizReady)).toEqual([true, false, true, false, true, true]);
    expect(quizzes[1].question).toBe("");
    expect(quizzes[1].correct).toBe(-1);
    expect(() => parseLocationContent("## 1 | Incomplete")).toThrow("Locatie 2 ontbreekt");
  });

  it("locks, activates, completes once and hides the answer until submission", async () => {
    const [quiz] = await loadLocationContent();
    const location: StoredLocation = { id: "1", quiz, status: "locked" };
    expect(() => transition(location, "start")).toThrow("op slot");
    expect(() => transition(location, "answer", 0)).toThrow("Activeer");
    expect(publicLocation(location)).toMatchObject({ name: "Locatie 1", status: "locked" });
    expect(publicLocation(location)).not.toHaveProperty("story");
    expect(publicLocation(location)).not.toHaveProperty("image");
    expect(publicLocation(location).quiz).toBeUndefined();
    transition(location, "unlock");
    expect(publicLocation(location)).toMatchObject({
      name: quiz.name,
      story: quiz.story,
      image: "/locations/cafe-rood-wit.png"
    });
    expect(publicLocation(location)).not.toHaveProperty("time");
    const unlockedAt = location.unlockedAt;
    transition(location, "unlock");
    expect(location.unlockedAt).toBe(unlockedAt);
    transition(location, "start");
    expect(publicLocation(location).quiz).not.toHaveProperty("correct");
    expect(publicLocation(location).result).toBeUndefined();
    expect(() => transition(location, "answer", 9)).toThrow("vier antwoorden");
    transition(location, "answer", 1);
    transition(location, "answer", 0);
    transition(location, "start");
    expect(location.status).toBe("completed");
    expect(location.answer).toBe(1);
    expect(publicLocation(location).result?.correct).toBe(false);
    expect(publicLocation(location).result?.correctAnswer).toBe(quiz.answers[0]);
  });

  it("omits legacy times from started quizzes", async () => {
    const [quiz] = await loadLocationContent();
    const legacy = { ...quiz, time: "12:30" };
    const view = publicLocation({ id: "1", quiz: legacy, status: "started" });
    expect(view).not.toHaveProperty("time");
    expect(view.quiz).not.toHaveProperty("time");
  });

  it("awards the configured bonus and releases locations with unfinished quizzes", async () => {
    const quizzes = await loadLocationContent();
    const location: StoredLocation = { id: "1", quiz: quizzes[0], status: "started" };
    transition(location, "answer", 0);
    expect(publicLocation(location).result).toMatchObject({
      correct: true,
      bonus: quizzes[0].bonus
    });
    for (const [index, quiz] of quizzes.entries()) {
      const location: StoredLocation = { id: String(index + 1), quiz, status: "locked" };
      transition(location, "unlock");
      expect(location.status).toBe("available");
      expect(publicLocation(location).name).toBe(quiz.name);
      if (!quizReady(quiz)) {
        expect(() => transition(location, "start")).toThrow("nog niet klaar");
        expect(location.status).toBe("available");
      }
    }
  });
});

const memory = vi.hoisted(() => ({
  locations: [] as StoredLocation[],
  resetId: undefined as string | undefined
}));
vi.mock("./locationStore", () => ({
  locationStore: async (mutate?: (state: typeof memory) => void) => {
    mutate?.(memory);
    return memory;
  }
}));
import { GET, POST } from "@/app/api/journey/route";
import { GET as adminGet, POST as adminPost } from "@/app/api/journey/admin/route";

describe("journey HTTP authorization", () => {
  beforeEach(async () => {
    memory.locations = (await loadLocationContent()).map((quiz, index) => ({
      id: String(index + 1),
      quiz,
      status: "locked"
    }));
  });
  afterEach(() => vi.unstubAllEnvs());
  function request(action: string, admin = false, origin = "http://localhost") {
    return new Request(`http://localhost/api/journey${admin ? "/admin" : ""}`, {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: "1", action, answer: 0 })
    });
  }
  it("hides locked identities from players while preserving them for administration", async () => {
    const player = await (await GET()).json();
    for (const location of player.locations) {
      expect(location.name).toBe(`Locatie ${location.id}`);
      expect(location).not.toHaveProperty("story");
      expect(location).not.toHaveProperty("image");
      expect(location).not.toHaveProperty("time");
    }
    const admin = await (await adminGet()).json();
    expect(admin.locations[0].name).toBe("Café Rood/Wit");
    await adminPost(request("unlock", true));
    const revealed = await (await GET()).json();
    expect(revealed.locations[0].name).toBe("Café Rood/Wit");
    expect(revealed.locations[0].image).toBe("/locations/cafe-rood-wit.png");
    expect(revealed.locations[1].name).toBe("Locatie 2");
  });

  it("does not allow unlocking through the player API or starting locked locations", async () => {
    expect((await POST(request("unlock"))).status).toBe(400);
    expect((await POST(request("start"))).status).toBe(409);
    expect(memory.locations[0].status).toBe("locked");
  });
  it("opens administration and releases locations without credentials", async () => {
    expect((await adminGet()).status).toBe(200);
    expect((await adminPost(request("unlock", true))).status).toBe(200);
    expect(memory.locations[0].status).toBe("available");
  });
  it("rejects cross-origin writes", async () => {
    expect((await adminPost(request("unlock", true, "https://other.example"))).status).toBe(403);
    expect((await POST(request("start", false, "https://other.example"))).status).toBe(403);
  });
  it("allows only administration to lock and restores completed results when re-enabled", async () => {
    await adminPost(request("unlock", true));
    await POST(request("start"));
    await POST(request("answer"));
    const rewardId = memory.locations[0].rewardId;
    expect((await POST(request("lock"))).status).toBe(400);
    expect((await adminPost(request("lock", true))).status).toBe(200);
    expect(memory.locations[0].status).toBe("locked");
    expect((await (await GET()).json()).locations[0].result).toBeUndefined();
    expect((await POST(request("start"))).status).toBe(409);
    expect((await adminPost(request("unlock", true))).status).toBe(200);
    expect(memory.locations[0].status).toBe("completed");
    expect(memory.locations[0].rewardId).toBe(rewardId);
  });
  it("shares admin unlocks, resumes started quizzes, and persists the earned card", async () => {
    expect((await adminPost(request("unlock", true))).status).toBe(200);
    const state = await (await GET()).json();
    expect(state.locations[0].status).toBe("available");
    expect(state.locations[0].quiz).toBeUndefined();
    const started = await (await POST(request("start"))).json();
    expect(started.locations[0].quiz).not.toHaveProperty("correct");
    expect((await (await GET()).json()).locations[0].status).toBe("started");
    await POST(request("answer"));
    expect((await (await GET()).json()).locations[0].result.correct).toBe(true);
  });
});

it("validates purchases and scores and preserves the first submission", async () => {
  const quizzes = await loadLocationContent();
  const purchase: StoredLocation = { id: "3", quiz: quizzes[2], status: "started" };
  expect(() => transition(purchase, "answer", 0)).toThrow("aankoop");
  transition(purchase, "answer", 1);
  expect(publicLocation(purchase).result?.correct).toBe(true);
  const score: StoredLocation = { id: "6", quiz: quizzes[5], status: "started" };
  for (const invalid of [-1, 1.5, "13", null])
    expect(() => transition(score, "answer", invalid)).toThrow("score");
  transition(score, "answer", 19);
  transition(score, "answer", 0);
  expect(publicLocation(score).result).toMatchObject({ correct: true, score: 19 });
});

it.each([0, 17, 18, 19, 30])("evaluates petanque score %i on the server", async (answer) => {
  const quizzes = await loadLocationContent();
  const location: StoredLocation = { id: "6", quiz: quizzes[5], status: "started" };
  transition(location, "answer", answer);
  expect(publicLocation(location).result).toMatchObject({
    score: answer,
    correct: answer >= 18,
    bonus: answer >= 18 ? "+30 Sneeuw" : ""
  });
});
