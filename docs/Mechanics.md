# Mechanics

## Purpose

Document the first gameplay systems for the Antwerp journey.

## Goals

- Keep the location loop modular and testable.
- Make every stop understandable during live play.
- Avoid hidden rules that only the app knows.
- Support quick manual correction if a GPS reading or roll is wrong.

## MVP Mechanics

### Journey Map

The app shows Antwerp as the board. Each location has a stable ID, display name, and activation state.

### Location Activation

A location becomes active when Matthew arrives within range or the organizer confirms the stop.

### Dice Entry

Matthew rolls physical dice. The app records the total and uses it to resolve the active location.

### Resource Tracking

Matthew has one resource ledger. Resources increase or change after location resolution.

### Location Rules

Each location defines which resource it uses and how the dice total maps to a reward or effect.

### Story Beats

Optional between-location prompts are allowed later, but they are not part of the first playable slice.

## Open Questions

- Should every location use the same dice scale or its own reward table?
- Should a location reward be a single resource or a bundle of resource types?
- Should the organizer be able to override an automatic activation?

## Future Improvements

- Intermission tasks.
- Story branching.
- Organizer tools.
- Route-specific rule packs.

## Related Documents

- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Events](./Events.md)
- [Feature 1 Plan](./Feature1Plan.md)
