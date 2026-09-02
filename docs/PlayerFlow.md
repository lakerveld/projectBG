# Player Flow

## Purpose

Describe the expected flow from opening the app to completing a stop on the Antwerp route.

## Goals

- Minimize friction while walking.
- Keep the phone useful without becoming the main focus.
- Make arrival, roll, and reward steps obvious.
- Support quick correction when GPS or dice input is off.

## MVP Flow

1. Open the app.
2. Resume the current journey or start a new one.
3. See the Antwerp map and the next location.
4. Walk to the location.
5. The app detects or confirms arrival.
6. The active location opens.
7. Matthew rolls the physical dice.
8. The dice total is entered in the app.
9. The app resolves the reward or effect.
10. The resource ledger updates.
11. Continue to the next location.

## Screen Step Pattern

Each major route step should live on its own screen or sheet:

- One screen shows the map and journey state.
- One screen confirms the active location.
- One screen records the dice total.
- One screen confirms the resource change.

This keeps the phone easy to use outside and avoids one overloaded dashboard.

## Error Recovery

The app must assume GPS drift and table pressure. Recovery options should include:

- Confirm arrival manually.
- Re-enter the dice total if needed.
- Add a correction entry with a reason.
- View the latest journey changes.

## Open Questions

- Should Matthew see the entire route or only the next location?
- Should the organizer be able to approve an arrival from a separate control?
- Should the app pause if a location is reached too early?

## Future Improvements

- Route replay.
- Extra story beats between locations.
- Route packs for different parts of Antwerp.
- Session recap screen.

## Related Documents

- [MVP](./MVP.md)
- [UX](./UX.md)
- [Mechanics](./Mechanics.md)
- [Game Design](./GameDesign.md)
- [Feature 1 Plan](./Feature1Plan.md)
