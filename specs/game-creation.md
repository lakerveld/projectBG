# Antwerp Map and Location Activation

## Problem

The app needs a first playable slice that shows Antwerp as the board, highlights the active location, and gives Matthew a clear next step when he reaches a stop.

## Scope

- Show the Antwerp map.
- Display the current and next location.
- Track GPS status.
- Mark a location as active when Matthew arrives.
- Allow manual organizer confirmation when needed.
- Persist the active location locally.

## User Flow

1. Open the app.
2. See the map and the next location.
3. Walk toward the stop.
4. The app detects arrival or the organizer confirms it.
5. The location becomes active.
6. The active location view opens.

## Domain Behavior

- Every location has a stable ID.
- Every location has a display name.
- Every location has activation bounds or a manual confirm path.
- Only one location should be active at a time.
- Activation should be recorded in the journey history.

## Data Shape

See [Feature 1 Plan](../docs/Feature1Plan.md) and [Mechanics](../docs/Mechanics.md).

## Acceptance Criteria

- The app shows an Antwerp map.
- Arrival can be detected or confirmed.
- The active location is obvious on screen.
- Activation state survives a refresh.

## Test Notes

- Unit tests should cover activation rules and invalid double activation.
- End-to-end tests should cover map display, arrival, activation, and reload.

## Related Docs

- [Feature 1 Plan](../docs/Feature1Plan.md)
- [Player Flow](../docs/PlayerFlow.md)
- [UX](../docs/UX.md)
