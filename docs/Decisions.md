# Decisions

## Purpose

Record product and architecture decisions so future contributors understand why the project is shaped this way.

## Goals

- Preserve context behind important choices.
- Avoid reopening settled decisions without new evidence.
- Make future pivots explicit.
- Support production-quality technical planning.

## Decision Log

### DEC-001: Build Web MVP Before Native App

Status: Accepted

Decision: Build the MVP as a Next.js web application before investing in native packaging.

Why: The biggest current risk is product usefulness during the Antwerp route, not App Store distribution. A web MVP is faster to iterate, easier to share for playtests, and still leaves a path to a native wrapper.

Consequences: Native APIs such as haptics, background behavior, and app-store-specific persistence are deferred.

### DEC-002: No Accounts for MVP

Status: Accepted

Decision: The first slice uses local journey state and no login.

Why: Account creation would add friction during a route and increase privacy, backend, and support complexity before the core loop is validated.

Consequences: Data recovery depends on local persistence and future export/import until cloud backup exists.

### DEC-003: Use Local-First Persistence

Status: Accepted

Decision: Store MVP journey data locally using IndexedDB behind a repository layer.

Why: The app must work without network access and persist after refresh. IndexedDB is better suited to structured records and larger histories than localStorage.

Consequences: Schema migrations must be planned early.

### DEC-004: Keep Domain Logic Outside React Components

Status: Accepted

Decision: Location rules, commands, validation, and reward resolution belong in `lib/domain`.

Why: Route logic is the core risk. Keeping it pure and testable reduces bugs and makes future cloud or native migration easier.

Consequences: Components should call commands or services rather than directly mutating complex journey objects.

### DEC-005: Use Zustand for MVP Client State

Status: Accepted

Decision: Use Zustand for app-level state during implementation.

Why: Zustand is lightweight and well suited for local, interactive React state. It avoids large framework overhead while supporting selectors and persistence hooks.

Consequences: The team should define store boundaries carefully to avoid one giant global object.

### DEC-006: Use Original Theming and Terminology

Status: Accepted

Decision: The app may be Catan-inspired at the idea level, but it should use original names, visuals, events, and resource language.

Why: The project should avoid depending on protected IP and should be able to become its own product identity.

Consequences: Design and game documents should avoid direct copyrighted presentation.

### DEC-007: Feature 1 Is Map and Location Activation

Status: Accepted

Decision: The first playable slice is the Antwerp map, arrival detection, location activation, physical dice entry, and resource resolution.

Why: This is the smallest loop that proves the core experience. It validates the city-as-board idea before adding story beats or other route systems.

Consequences: Later systems such as intermission tasks, organizer tools, and route branching are deferred until the map loop is stable.

### DEC-008: Use Snapshot Plus History for MVP Persistence

Status: Accepted

Decision: Persist the current journey snapshot while also recording meaningful history entries.

Why: Snapshots make resume fast and simple. History keeps route changes explainable and creates a path toward undo, audit, and future replay behavior.

Consequences: Commands must update both state and history consistently.

### DEC-009: Use One Major Route Step Per Screen

Status: Accepted

Decision: Major route steps move to their own screens or sheets.

Why: A shared-phone journey app must stay readable at a glance and easy to use while walking. Separating steps keeps each screen focused on one decision or ceremony.

Consequences: Map, active location, dice entry, and resource updates should not be merged into one overloaded dashboard unless later testing proves that necessary.

### DEC-010: Start With a Static Antwerp Map Shell

Status: Accepted

Decision: Sprint 1 uses a curated static route shell with location pins and a mocked GPS status instead of a live map library.

Why: The first risk is whether the route flow reads clearly on a phone. A static shell lets us validate mobile layout, route hierarchy, and stop labeling before adding browser geolocation or map-provider complexity.

Consequences: Early route screens can use percentage-based pin positions and local route data. Real GPS integration and map APIs stay behind the shell until the activation sprint.

## Open Questions

- Should organizer confirmation be mandatory for every stop or only GPS edge cases?
- Should route packs be content files or generated from a small editor?
- Should the first release support one fixed Antwerp route or a handful of curated stops?

## Future Improvements

- Add a formal ADR template.
- Add decision IDs to related pull requests.
- Revisit proposed decisions after route testing.

## Related Documents

- [Architecture](./Architecture.md)
- [Database](./Database.md)
- [State Management](./StateManagement.md)
- [Tech Stack](./TechStack.md)
- [Roadmap](./Roadmap.md)
