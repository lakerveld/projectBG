// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { locationStore } from "./locationStore";
import { transition } from "@/lib/domain/locationGame";
import { POST as adminPost } from "@/app/api/journey/admin/route";
import { POST as journeyPost } from "@/app/api/journey/route";

let saved: string | null;
beforeEach(() => {
  saved = null;
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("KV_REST_API_TOKEN", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: RequestInit) => {
      const [rawCommand, ...args] = JSON.parse(init.body as string);
      const command = rawCommand.toUpperCase();
      let result: string | number | null;
      if (command === "GET") result = saved;
      else if (command === "EVAL") {
        if ((saved ?? "") === args[3]) {
          saved = args[4];
          result = 1;
        } else result = 0;
      } else throw new Error("Unexpected command");
      return new Response(JSON.stringify({ result }));
    })
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("persists unlocks across reads and prevents concurrent answers from overwriting the result", async () => {
  await locationStore((state) => transition(state.locations[0], "unlock"));
  expect((await locationStore()).locations[0].status).toBe("available");
  await locationStore((state) => transition(state.locations[0], "start"));
  const results = await Promise.all([
    locationStore((state) => transition(state.locations[0], "answer", 0)),
    locationStore((state) => transition(state.locations[0], "answer", 1))
  ]);
  const final = (await locationStore()).locations[0];
  expect(final.status).toBe("completed");
  expect(results[0].locations[0].answer).toBe(final.answer);
  expect(results[1].locations[0].answer).toBe(final.answer);
});

it("does not write when a transition fails", async () => {
  await expect(locationStore((state) => transition(state.locations[0], "start"))).rejects.toThrow(
    "op slot"
  );
  expect(saved).toBeNull();
});

it("resets all locations and publishes a new reset ID while preserving configured quizzes", async () => {
  await locationStore((state) => {
    for (const location of state.locations) {
      location.status = "completed";
      location.answer = location.quiz.correct;
      location.unlockedAt = 123;
    }
  });
  const response = await adminPost(
    new Request("https://game.example/api/journey/admin", {
      method: "POST",
      headers: { origin: "https://game.example" },
      body: JSON.stringify({ action: "reset" })
    })
  );
  expect(response.status).toBe(200);
  const view = await response.json();
  expect(view.locations).toHaveLength(6);
  expect(view.resetId).toEqual(expect.any(String));
  expect((await locationStore()).resetId).toBe(view.resetId);
  for (const location of view.locations) {
    expect(location.status).toBe("locked");
    expect(location.result).toBeUndefined();
  }
  for (const location of (await locationStore()).locations) {
    expect(location.status).toBe("locked");
    expect(location.answer).toBeUndefined();
    expect(location.unlockedAt).toBeUndefined();
    expect(location.statusBeforeLock).toBeUndefined();
    expect(location.rewardId).toBeUndefined();
  }
  await locationStore((state) => transition(state.locations[0], "unlock"));
  expect((await locationStore()).locations[0].status).toBe("available");
});

it("rejects reset from another origin and from the player endpoint", async () => {
  const request = (origin: string) =>
    new Request("https://game.example/api/journey/admin", {
      method: "POST",
      headers: { origin },
      body: JSON.stringify({ action: "reset" })
    });
  expect((await adminPost(request("https://other.example"))).status).toBe(403);
  expect((await journeyPost(request("https://game.example"))).status).toBe(400);
  expect(saved).toBeNull();
});

it("fails closed in production without shared storage or with partial configuration", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  await expect(locationStore()).rejects.toThrow("zowel de URL als het token");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  await expect(locationStore()).rejects.toThrow("nog niet ingesteld");
});

it("uses Vercel KV credentials for shared storage in production", async () => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("KV_REST_API_URL", "https://vercel-redis.example");
  vi.stubEnv("KV_REST_API_TOKEN", "vercel-test-token");
  const { locationStore: vercelStore } = await import("./locationStore");
  await vercelStore((state) => transition(state.locations[0], "unlock"));
  expect((await vercelStore()).locations[0].status).toBe("available");
  expect(fetch).toHaveBeenCalledWith(
    "https://vercel-redis.example",
    expect.objectContaining({
      headers: expect.objectContaining({ authorization: "Bearer vercel-test-token" })
    })
  );
});

it("reports unavailable Redis instead of using a divergent local game", async () => {
  vi.mocked(fetch).mockRejectedValue(new Error("offline"));
  await expect(locationStore()).rejects.toThrow("offline");
});

it("saves admin quiz edits, preserves them across reads and resets, and hides correct answers", async () => {
  const original = (await locationStore()).locations[0].quiz;
  const content = { ...original, name: "Nieuwe locatie", question: "Nieuwe vraag?", correct: 2 };
  const save = (value: unknown) =>
    adminPost(
      new Request("https://game.example/api/journey/admin", {
        method: "POST",
        headers: { origin: "https://game.example" },
        body: JSON.stringify({ id: "2", action: "save", content: value })
      })
    );
  expect((await save(content)).status).toBe(200);
  expect((await locationStore()).locations[1].quiz).toEqual(content);
  await locationStore((state) => {
    transition(state.locations[1], "unlock");
    transition(state.locations[1], "start");
    transition(state.locations[1], "answer", 2);
  });
  expect((await save(content)).status).toBe(200);
  const edited = (await locationStore()).locations[1];
  expect(edited.status).toBe("available");
  expect(edited.answer).toBeUndefined();
  expect(edited.unlockedAt).toBeTypeOf("number");
  await adminPost(
    new Request("https://game.example/api/journey/admin", {
      method: "POST",
      headers: { origin: "https://game.example" },
      body: JSON.stringify({ action: "reset" })
    })
  );
  expect((await locationStore()).locations[1].quiz).toEqual(content);
  const { GET } = await import("@/app/api/journey/route");
  const player = await (await GET()).json();
  expect(player.locations[1].content).toBeUndefined();
  expect(player.locations[1].quiz).toBeUndefined();
  expect((await save({ ...content, correct: 8 })).status).toBe(409);
  expect((await locationStore()).locations[1].quiz).toEqual(content);
});

it("preserves custom assignment instructions when migrating legacy quest types", async () => {
  await locationStore((state) => {
    const location = state.locations[2];
    location.status = "available";
    location.contentOverride = true;
    delete location.quiz.type;
    location.quiz.question = "Vraag een medewerker om een kaas voor Ratten en koop deze.";
  });
  const location = (await locationStore()).locations[2];
  expect(location.quiz.type).toBe("purchase");
  expect(location.quiz.question).toBe("Vraag een medewerker om een kaas voor Ratten en koop deze.");
});
