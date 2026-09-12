// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadLocationContent, parseLocationContent } from "./locationContent";
import {
  publicLocation,
  quizReady,
  transition,
  type StoredLocation
} from "@/lib/domain/locationGame";
import { adminAuthorized } from "./journeyHttp";

describe("location content and transitions", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("loads all eight real map locations and only enables the completed quiz", async () => {
    const quizzes = await loadLocationContent();
    expect(quizzes).toHaveLength(8);
    expect(quizzes[0].name).toBe("Het Bierpaleis");
    expect(quizzes.map(quizReady)).toEqual([true, false, false, false, false, false, false, false]);
    expect(quizzes[1].question).toBe("");
    expect(quizzes[1].correct).toBe(-1);
    expect(() => parseLocationContent("## 1 | Incomplete")).toThrow("Locatie 2 ontbreekt");
  });

  it("locks, activates, completes once and hides the answer until submission", async () => {
    const [quiz] = await loadLocationContent();
    const location: StoredLocation = { id: "1", quiz, status: "locked" };
    expect(() => transition(location, "start")).toThrow("op slot");
    expect(() => transition(location, "answer", 0)).toThrow("Activeer");
    expect(publicLocation(location).quiz).toBeUndefined();
    transition(location, "unlock");
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

  it("awards the configured bonus and refuses to release an empty quiz", async () => {
    const quizzes = await loadLocationContent();
    const location: StoredLocation = { id: "1", quiz: quizzes[0], status: "started" };
    transition(location, "answer", 0);
    expect(publicLocation(location).result).toMatchObject({
      correct: true,
      bonus: quizzes[0].bonus
    });
    expect(() => transition({ id: "2", quiz: quizzes[1], status: "locked" }, "unlock")).toThrow(
      "Vul eerst"
    );
  });

  it("requires a configured strong admin password and an exact authorization header", () => {
    vi.stubEnv("JOURNEY_ADMIN_PASSWORD", "test-password-long-enough");
    const request = (secret: string) =>
      new Request("http://localhost/api/journey/admin", { headers: { Authorization: secret } });
    expect(adminAuthorized(request("Bearer test-password-long-enough"))).toBe(true);
    expect(adminAuthorized(request("Bearer wrong"))).toBe(false);
    vi.stubEnv("JOURNEY_ADMIN_PASSWORD", "");
    expect(adminAuthorized(request("Bearer "))).toBe(false);
  });
});

const memory = vi.hoisted(() => ({ locations: [] as StoredLocation[] }));
vi.mock("./locationStore", () => ({
  locationStore: async (mutate?: (state: typeof memory) => void) => {
    mutate?.(memory);
    return memory;
  }
}));
import { GET, POST } from "@/app/api/journey/route";
import { POST as adminPost } from "@/app/api/journey/admin/route";

describe("journey HTTP authorization", () => {
  beforeEach(async () => {
    memory.locations = (await loadLocationContent()).map((quiz, index) => ({
      id: String(index + 1),
      quiz,
      status: "locked"
    }));
    vi.stubEnv("JOURNEY_ADMIN_PASSWORD", "test-password-long-enough");
  });
  afterEach(() => vi.unstubAllEnvs());
  function request(action: string, admin = false, origin = "http://localhost") {
    return new Request(`http://localhost/api/journey${admin ? "/admin" : ""}`, {
      method: "POST",
      headers: {
        Origin: origin,
        Authorization: "Bearer test-password-long-enough",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: "1", action, answer: 0 })
    });
  }
  it("does not allow unlocking through the player API or starting locked locations", async () => {
    expect((await POST(request("unlock"))).status).toBe(400);
    expect((await POST(request("start"))).status).toBe(409);
    expect(memory.locations[0].status).toBe("locked");
  });
  it("rejects unauthorized and cross-origin admin writes", async () => {
    const unauthorized = request("unlock", true);
    unauthorized.headers.delete("authorization");
    expect((await adminPost(unauthorized)).status).toBe(403);
    expect((await adminPost(request("unlock", true, "https://other.example"))).status).toBe(403);
    expect((await POST(request("start", false, "https://other.example"))).status).toBe(403);
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
