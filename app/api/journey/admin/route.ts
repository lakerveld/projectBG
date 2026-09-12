import { locationStore } from "@/lib/server/locationStore";
import { publicLocation, transition } from "@/lib/domain/locationGame";
import { json, readCommand, sameOrigin } from "@/lib/server/journeyHttp";
import { loadLocationContent } from "@/lib/server/locationContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await locationStore();
    return json({ locations: state.locations.map(publicLocation) });
  } catch {
    return json({ error: "Opslag niet beschikbaar. Controleer de serverinstellingen." }, 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Geen toegang." }, 403);
  try {
    const { id, action } = await readCommand(request);
    if (action !== "unlock" && action !== "reset") return json({ error: "Ongeldige actie." }, 400);
    const content = action === "reset" ? await loadLocationContent() : undefined;
    const state = await locationStore((state) => {
      if (content) {
        state.locations = content.map((quiz, index) => ({
          id: String(index + 1),
          quiz,
          status: "locked"
        }));
        return;
      }
      const location = state.locations.find((item) => item.id === id);
      if (!location) throw new Error("Onbekende locatie.");
      transition(location, "unlock");
    });
    return json({ locations: state.locations.map(publicLocation) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Opslaan mislukt." }, 409);
  }
}
