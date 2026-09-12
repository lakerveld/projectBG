import { locationStore } from "@/lib/server/locationStore";
import { publicLocation, transition } from "@/lib/domain/locationGame";
import { adminAuthorized, json, readCommand, sameOrigin } from "@/lib/server/journeyHttp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!adminAuthorized(request))
    return json({ error: "Ongeldig beheerwachtwoord of beheer nog niet ingesteld." }, 401);
  try {
    const state = await locationStore();
    return json({ locations: state.locations.map(publicLocation) });
  } catch {
    return json({ error: "Opslag niet beschikbaar. Controleer de serverinstellingen." }, 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request) || !adminAuthorized(request))
    return json({ error: "Geen toegang." }, 403);
  try {
    const { id, action } = await readCommand(request);
    if (action !== "unlock") return json({ error: "Ongeldige actie." }, 400);
    const state = await locationStore((state) => {
      const location = state.locations.find((item) => item.id === id);
      if (!location) throw new Error("Onbekende locatie.");
      transition(location, "unlock");
    });
    return json({ locations: state.locations.map(publicLocation) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Vrijgeven mislukt." }, 409);
  }
}
