# Vision

## Purpose

Define the long-term direction for **Ketanisten van Rattan**.

## Product Vision

Ketanisten van Rattan is a personal Antwerp quest for Matthew. The app turns the city into the board, uses GPS to know where Matthew is, and uses physical dice to resolve what happens at each location. The experience should feel like a guided treasure hunt with a Catan-inspired resource layer, not like a generic board-game companion.

## Goals

- Make one shared phone or one carried phone useful during the route.
- Show Matthew where he is, what location is active, and what resource changes happen next.
- Keep the journey state local for the MVP.
- Support future story beats, organizer control, and richer map logic without rebuilding the core loop.

## Non-Goals

- Multiplayer competition.
- Online accounts or cloud saves.
- Recreating Catan rules exactly.
- Requiring board-game terms or protected assets from other games.

## Product Principles

- Location first: the map and arrival state are the main experience.
- Physical dice first: the app records the roll, it does not replace it.
- Shared-screen clarity: the active step must be readable at a glance.
- Local trust: the app should survive refresh and continue the journey.
- Modular growth: story beats and extra tasks can be added later without changing the core map loop.

## Open Questions

- Should GPS arrival be automatic only, or should the organizer always be able to confirm it?
- Should location rewards be fully rule-driven or partly curated per stop?
- How much of the story should be visible before Matthew reaches a location?

## Future Improvements

- Route-specific story packs.
- Organizer tools for pacing and overrides.
- Richer map art and animated location states.
- Optional cloud backup for saved journeys.

## Related Documents

- [MVP](./MVP.md)
- [Roadmap](./Roadmap.md)
- [Game Design](./GameDesign.md)
- [Architecture](./Architecture.md)
- [UX](./UX.md)
