# GPS Arrival Confirmation

## Problem

GPS can be noisy, and the route needs a reliable way to decide when Matthew has really reached a stop.

## Scope

- Confirm arrival automatically when GPS is confident.
- Allow manual organizer confirmation when GPS is uncertain.
- Keep a single active location.
- Record the activation in history.

## User Flow

1. Matthew reaches a location.
2. The app checks GPS.
3. If the signal is clear, the stop activates.
4. If the signal is unclear, the organizer confirms arrival.
5. The active location sheet opens.

## Domain Behavior

- A location cannot activate twice in a row.
- Manual confirmation and GPS activation should lead to the same state.
- The current active location should be stored in the journey snapshot.

## Data Shape

See [Feature 1 Plan](../docs/Feature1Plan.md) and [Mechanics](../docs/Mechanics.md).

## Acceptance Criteria

- The app can confirm arrival from GPS or organizer input.
- The active location state is saved.
- The route history records the stop activation.

## Test Notes

- Unit tests should cover GPS-confirmed and manually confirmed activation.
- End-to-end tests should cover the edge case where GPS is uncertain.

## Related Docs

- [Feature 1 Plan](../docs/Feature1Plan.md)
- [Player Flow](../docs/PlayerFlow.md)
- [UX](../docs/UX.md)
