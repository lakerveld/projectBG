export type JourneyGpsStatus = "searching" | "locked" | "manual";

export type JourneyLocationStatus = "completed" | "current" | "upcoming";

export type JourneyLocation = {
  id: string;
  name: string;
  district: string;
  note: string;
  status: JourneyLocationStatus;
  pinX: number;
  pinY: number;
};

export type JourneyRouteState = {
  title: string;
  subtitle: string;
  gpsStatus: JourneyGpsStatus;
  gpsMessage: string;
  currentLocationId: string;
  nextLocationId: string | null;
  locations: JourneyLocation[];
};

export const ANTWERP_JOURNEY_STATE: JourneyRouteState = {
  title: "Antwerp Journey",
  subtitle: "Matthew's route companion",
  gpsStatus: "searching",
  gpsMessage: "Waiting for a confident GPS fix before the first stop activates.",
  currentLocationId: "het-steen",
  nextLocationId: "groenplaats",
  locations: [
    {
      id: "het-steen",
      name: "Het Steen",
      district: "River edge",
      note: "Starting point and the first anchor on the route.",
      status: "current",
      pinX: 18,
      pinY: 72
    },
    {
      id: "groenplaats",
      name: "Groenplaats",
      district: "Old town",
      note: "The first target stop for the journey.",
      status: "upcoming",
      pinX: 38,
      pinY: 48
    },
    {
      id: "cathedral-square",
      name: "Cathedral Square",
      district: "Historic center",
      note: "A central waypoint with a wide, readable approach.",
      status: "upcoming",
      pinX: 57,
      pinY: 34
    },
    {
      id: "central-station",
      name: "Central Station",
      district: "Transport hub",
      note: "The route finish for the first shell.",
      status: "upcoming",
      pinX: 79,
      pinY: 18
    }
  ]
};

export function getJourneyLocation(state: JourneyRouteState, locationId: string | null) {
  if (!locationId) {
    return null;
  }

  return state.locations.find((location) => location.id === locationId) ?? null;
}

export function getJourneyProgress(state: JourneyRouteState) {
  const completed = state.locations.filter((location) => location.status === "completed").length;
  const current = getJourneyLocation(state, state.currentLocationId);
  const next = getJourneyLocation(state, state.nextLocationId);

  return {
    completed,
    total: state.locations.length,
    current,
    next,
    percent: Math.round((completed / state.locations.length) * 100)
  };
}

