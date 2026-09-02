# Roadmap

## Purpose

Describe the delivery plan from foundation work to the first playable Antwerp route.

## Goals

- Keep early work focused on a usable local MVP.
- Avoid premature cloud or native complexity.
- Create clear checkpoints for design, implementation, testing, and validation.
- Maintain a backlog that separates feature 1 from future route content.

## Phase 0: Foundation

- Keep the repository structure and documentation aligned with the new concept.
- Define architecture decisions and coding standards.
- Confirm the first feature scope.
- Prepare prompt folders for assisted design and implementation workflows.

## Phase 1: Map Shell

- Build the first Antwerp map screen.
- Show Matthew's current journey state.
- Add the route header, next location preview, and GPS status.
- Create the design and component vocabulary for map and location states.

## Phase 2: Location Activation

- Detect or confirm arrival at a location.
- Mark the location as active.
- Open the location sheet or screen.
- Show the route progress and current stop clearly.

## Phase 3: Dice and Rewards

- Enter physical dice totals manually.
- Resolve the active location using the dice table.
- Update Matthew's resources locally.
- Record the result in the journey log.

## Phase 4: Persistence and Hardening

- Persist the current journey locally.
- Add correction and recovery flows.
- Test on real phone viewports.
- Tune GPS, map readability, and resource language.

## Phase 5: Future Route Content

- Add intermission tasks between locations.
- Add story beats and route branching.
- Add organizer override tools.
- Evaluate cloud backup and future app packaging only after the first route slice works well.

## Open Questions

- What is the minimum route length needed to validate the first playable slice?
- Should GPS arrival be automatic only or always paired with an organizer confirmation?
- Which map data format is easiest to maintain for future route packs?

## Future Improvements

- Route packs.
- Campaign mode.
- Shared device handoff.
- Cloud sync with opt-in accounts.

## Related Documents

- [Backlog](./Backlog.md)
- [Sprint 0](./Sprint0.md)
- [Sprint 1](./Sprint1.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
- [Sprint 5](./Sprint5.md)
- [Architecture](./Architecture.md)
- [Decisions](./Decisions.md)
- [Feature 1 Plan](./Feature1Plan.md)
