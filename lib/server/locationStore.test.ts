// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { locationStore } from "./locationStore";
import { transition } from "@/lib/domain/locationGame";

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
