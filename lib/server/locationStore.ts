import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { StoredLocation } from "@/lib/domain/locationGame";
import { loadLocationContent } from "./locationContent";

type State = { locations: StoredLocation[] };
const globals = globalThis as typeof globalThis & { journeyQueue?: Promise<unknown> };

let redis: Redis | undefined;

function redisClient() {
  redis ??= Redis.fromEnv({ automaticDeserialization: false, enableAutoPipelining: false });
  return redis;
}

async function hydrate(raw: string | null): Promise<State> {
  const content = await loadLocationContent();
  const state: State = raw
    ? JSON.parse(raw)
    : {
        locations: content.map((quiz, index) => ({
          id: String(index + 1),
          quiz,
          status: "locked"
        }))
      };
  // Once released, keep the question and reward stable across content deployments.
  state.locations.forEach((location, index) => {
    if (location.status === "locked") location.quiz = content[index];
  });
  return state;
}

export async function locationStore(mutate?: (state: State) => void): Promise<State> {
  if (
    Boolean(process.env.UPSTASH_REDIS_REST_URL) !== Boolean(process.env.UPSTASH_REDIS_REST_TOKEN)
  ) {
    throw new Error("Stel zowel de URL als het token van de gedeelde opslag in.");
  }
  const hasRedis = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
  if (hasRedis) {
    const redis = redisClient();
    const key = `rattan:journey:${process.env.JOURNEY_GAME_ID || "matthew"}`;
    for (let attempt = 0; attempt < 5; attempt++) {
      const raw = await redis.get<string | null>(key);
      const state = await hydrate(raw);
      if (!mutate) return state;
      mutate(state);
      const saved = await redis.eval<unknown[], number>(
        "local old = redis.call('GET', KEYS[1]); if (old or '') ~= ARGV[1] then return 0 end; redis.call('SET', KEYS[1], ARGV[2]); return 1",
        [key],
        [raw ?? "", JSON.stringify(state)]
      );
      if (saved === 1) return state;
    }
    throw new Error("De status is net gewijzigd. Probeer opnieuw.");
  }
  if (process.env.NODE_ENV === "production")
    throw new Error("De gedeelde opslag is nog niet ingesteld.");
  // One local Next server; a durable file and process-wide queue for development.
  const operation = async () => {
    const file = path.join(process.cwd(), ".journey-data", "state.json");
    let raw: string | null = null;
    try {
      raw = await readFile(file, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const state = await hydrate(raw);
    if (mutate) {
      mutate(state);
      await mkdir(path.dirname(file), { recursive: true });
      const temporary = `${file}.${randomUUID()}`;
      await writeFile(temporary, JSON.stringify(state), { mode: 0o600 });
      await rename(temporary, file);
    }
    return state;
  };
  const queued = (globals.journeyQueue ?? Promise.resolve()).then(operation, operation);
  globals.journeyQueue = queued.catch(() => {});
  return queued;
}
