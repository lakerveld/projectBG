# MVP

## Purpose

Define the first releasable product slice for Matthew's Antwerp journey.

## MVP Outcome

Matthew can open the app, see the Antwerp map, arrive at a location, enter a physical dice result, and receive the resource update for that stop.

## MVP Goals

- Support one journey on one phone.
- Require no account or network connection.
- Recover the current journey after refresh.
- Keep the experience focused on the next location and the current roll.
- Keep the first slice small enough to test in the city.

## MVP Features

- Show an Antwerp map with curated locations.
- Track Matthew's journey state locally.
- Detect or confirm arrival at a location.
- Enter a physical dice total manually.
- Resolve location-specific resources from the roll.
- Update Matthew's resource ledger.
- Persist the active journey locally.

## MVP Constraints

- Browser-first web app.
- Mobile-first layout.
- No login.
- No server database.
- No multiplayer flow.
- No direct Catan art, names, or official rule text.

## Current Build Focus

The immediate implementation focus is feature 1:

- Map view with Antwerp locations.
- GPS arrival and location activation.
- Location-specific dice resolution.
- Resource ledger updates.
- Local persistence of the current journey.

Extra story beats, intermission tasks, multiplayer, trading, and conflict mechanics are future work.

## Acceptance Criteria

- The app shows the Antwerp journey clearly.
- Arrival at a location can be confirmed.
- A valid dice total changes the resource ledger.
- The current journey survives a refresh.
- The app stays usable on a modern phone viewport.

## Open Questions

- Should GPS detection be fully automatic or always paired with an organizer confirm button?
- Should location rewards be fixed per stop or configurable in a data file?
- Should Matthew see the full route or only the current next stop?

## Future Improvements

- Story beats between locations.
- Route branching.
- Organizer override tools.
- More detailed progress history.
- Optional cloud backup.

## Related Documents

- [Vision](./Vision.md)
- [Mechanics](./Mechanics.md)
- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Player Flow](./PlayerFlow.md)
- [Roadmap](./Roadmap.md)
- [Feature 1 Plan](./Feature1Plan.md)
