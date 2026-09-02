# Sprint 3

## Purpose

Implement manual dice entry and location resolution.

## Goals

- Let Matthew enter a physical dice total.
- Resolve the active location from the roll.
- Show the immediate result of the stop.

## Scope

- Add total-only dice entry from 2 to 12.
- Resolve the active location using a reward table.
- Record the roll and result in the journey log.
- Add unit tests for dice validation and reward resolution.

## Out of Scope

- Story beats.
- Multiplayer.
- Trade, attack, or defense.
- App-generated rolls.

## Definition of Done

- Matthew can enter a roll after arrival.
- The app resolves the location reward from the roll.
- The result is visible in the journey log.
- Invalid rolls are rejected.

## Open Questions

- Should one location allow more than one roll?
- Should the result panel be full screen or a bottom sheet?
- Should reward tables vary by location or by route pack?

## Future Improvements

- Add richer reward logic.
- Add animation or sound for the roll result.
- Continue with resource tracking in [Sprint 4](./Sprint4.md).

## Related Documents

- [Sprint 2](./Sprint2.md)
- [Sprint 4](./Sprint4.md)
- [Feature 1 Plan](./Feature1Plan.md)
