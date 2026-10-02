import { locationStore } from "@/lib/server/locationStore";
import { publicLocation, transition } from "@/lib/domain/locationGame";
import { json, sameOrigin } from "@/lib/server/journeyHttp";
import type { LocationQuizContent, StoredLocation } from "@/lib/domain/locationGame";

const adminLocation = (location: StoredLocation) => ({ ...publicLocation(location), content: location.quiz });

function readContent(value: unknown): LocationQuizContent {
  if (!value || typeof value !== "object") throw new Error("Ongeldige quiz.");
  const quiz = value as Record<string, unknown>;
  const text = (key: string, max: number) => {
    const value = quiz[key] ?? "";
    if (typeof value !== "string" || value.length > max) throw new Error(`Ongeldig veld: ${key}.`);
    return value.trim();
  };
  const name = text("name", 200);
  if (!name) throw new Error("Vul een locatienaam in.");
  if (!Array.isArray(quiz.answers) || quiz.answers.length !== 4 || quiz.answers.some((answer) => typeof answer !== "string" || answer.length > 2000)) throw new Error("Vul vier antwoordvelden in.");
  if (typeof quiz.correct !== "number" || !Number.isInteger(quiz.correct) || quiz.correct < -1 || quiz.correct > 3) throw new Error("Kies een geldig correct antwoord.");
  return { name, time: text("time", 200), story: text("story", 5000), question: text("question", 2000), bonus: text("bonus", 2000), answers: quiz.answers.map((answer: string) => answer.trim()), correct: quiz.correct };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await locationStore();
    return json({ locations: state.locations.map(adminLocation) });
  } catch {
    return json({ error: "Opslag niet beschikbaar. Controleer de serverinstellingen." }, 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Geen toegang." }, 403);
  try {
    const text = await request.text();
    if (text.length > 24000) throw new Error("Verzoek te groot.");
    const { id, action, content } = JSON.parse(text);
    if (!["unlock", "reset", "save"].includes(action)) return json({ error: "Ongeldige actie." }, 400);
    const quiz = action === "save" ? readContent(content) : undefined;
    const state = await locationStore((state) => {
      if (action === "reset") {
        for (const location of state.locations) {
          location.status = "locked";
          delete location.answer;
          delete location.unlockedAt;
        }
        return;
      }
      const location = state.locations.find((item) => item.id === id);
      if (!location) throw new Error("Onbekende locatie.");
      if (quiz) {
        location.quiz = quiz;
        location.contentOverride = true;
        location.status = "locked";
        delete location.answer;
        delete location.unlockedAt;
      } else transition(location, "unlock");
    });
    return json({ locations: state.locations.map(adminLocation) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Opslaan mislukt." }, 409);
  }
}
