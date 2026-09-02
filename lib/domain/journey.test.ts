import { describe, expect, it } from "vitest";
import { ANTWERP_JOURNEY_STATE, getJourneyLocation, getJourneyProgress } from "./journey";

describe("journey route state", () => {
  it("keeps a stable Antwerp route shell shape", () => {
    expect(ANTWERP_JOURNEY_STATE.title).toBe("Antwerp Journey");
    expect(ANTWERP_JOURNEY_STATE.locations).toHaveLength(4);
    expect(ANTWERP_JOURNEY_STATE.currentLocationId).toBe("het-steen");
    expect(ANTWERP_JOURNEY_STATE.nextLocationId).toBe("groenplaats");
    expect(ANTWERP_JOURNEY_STATE.locations[0]?.status).toBe("current");
    expect(ANTWERP_JOURNEY_STATE.locations[1]?.status).toBe("upcoming");
  });

  it("derives the current and next location from the route state", () => {
    const progress = getJourneyProgress(ANTWERP_JOURNEY_STATE);

    expect(progress.current?.name).toBe("Het Steen");
    expect(progress.next?.name).toBe("Groenplaats");
    expect(progress.completed).toBe(0);
    expect(progress.total).toBe(4);
    expect(progress.percent).toBe(0);
    expect(getJourneyLocation(ANTWERP_JOURNEY_STATE, "missing")).toBeNull();
  });
});

