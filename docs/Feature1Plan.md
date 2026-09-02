# Feature 1 Plan

## Purpose

Define the first playable slice for **Ketanisten van Rattan**.

## Concept

Matthew is the only active player. The app supports a guided Antwerp journey where the city acts as the board, GPS confirms arrival at a location, physical dice are entered in the app, and the location decides which resources are awarded or updated.

## Feature 1 Scope

- Show an Antwerp map with curated locations.
- Track Matthew's live position with GPS.
- Activate a location when Matthew arrives.
- Present the active location as a clear full-screen or bottom-sheet step.
- Accept a physical dice total from 2 to 12.
- Resolve the location using a location-specific resource table.
- Update Matthew's resource ledger locally.
- Persist the current journey state on the device.

## Feature 1 Flow

1. Open the app.
2. Resume the current journey or start a new one.
3. See the Antwerp map and the next target location.
4. Walk to the location.
5. The app detects arrival or the organizer confirms it.
6. The active location opens.
7. Matthew rolls physical dice.
8. The total is entered in the app.
9. The app resolves the location reward.
10. The resource ledger updates and the map advances to the next step.

## Data Model

Each location should at least know:

- Location ID.
- Display name.
- GPS or proximity bounds.
- Resource type or reward table.
- Activation status.
- Optional story or task hook.

Example shape:

```ts
type JourneyLocation = {
  id: string;
  name: string;
  resourceKey: string;
  activationRadiusMeters: number;
  rewardTable: Record<number, string>;
  isActive: boolean;
};
```

## Acceptance Criteria

- The app shows the Antwerp journey map.
- The app can detect or confirm arrival at a location.
- The active location can be resolved with a dice total.
- Matthew's resources update after a valid roll.
- The journey state survives a refresh.
- The UI clearly shows the next location and the current location.

## Out of Scope

- Multiplayer.
- Trading.
- Attack and defense.
- Full story branching.
- Cloud sync.
- App Store packaging.

## Related Docs

- [Vision](./Vision.md)
- [MVP](./MVP.md)
- [Roadmap](./Roadmap.md)
- [Player Flow](./PlayerFlow.md)
- [Mechanics](./Mechanics.md)
- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
