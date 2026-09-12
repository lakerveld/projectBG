import { locationStore } from "@/lib/server/locationStore";
import { publicLocation, transition } from "@/lib/domain/locationGame";
import { json, readCommand, sameOrigin } from "@/lib/server/journeyHttp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await locationStore();
    return json({ locations: state.locations.map(publicLocation) });
  } catch {
    return json({ error: "Locaties zijn tijdelijk niet bereikbaar. Probeer het opnieuw." }, 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Ongeldige herkomst." }, 403);
  try {
    const { id, action, answer } = await readCommand(request);
    if (action !== "start" && action !== "answer") return json({ error: "Ongeldige actie." }, 400);
    const state = await locationStore((state) => {
      const location = state.locations.find((item) => item.id === id);
      if (!location) throw new Error("Onbekende locatie.");
      transition(location, action, answer);
    });
    return json({ locations: state.locations.map(publicLocation) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Opslaan mislukt." }, 409);
  }
}
