# Game Design

## Purpose

Set the gameplay direction for the Antwerp journey.

## Design Goals

- Make the city itself feel like the board.
- Keep Matthew's next step obvious at all times.
- Let physical dice drive the tension.
- Make resource changes easy to explain on the spot.
- Allow the organizer to pace the experience without forcing the app to over-control it.

## Core Loop

1. Matthew moves toward a location in Antwerp.
2. The app detects or confirms arrival.
3. The location activates.
4. Matthew rolls physical dice.
5. The total is entered in the app.
6. The app resolves the location-specific resource reward or effect.
7. The map and resource ledger update.
8. Matthew continues to the next location.

## Companion Mechanics

The first feature should focus on location-driven progress rather than on abstract board-game turns. Good companion mechanics for this concept are:

- Location-specific resource tables.
- Arrival state and proximity feedback.
- Optional organizer confirmation for edge cases.
- Clear story or challenge hooks between stops.
- A visible resource ledger that always reflects the latest state.

## Balance Direction

The MVP should favor clarity over complexity. Every stop should answer these questions:

- Where am I?
- What did I roll?
- What do I gain?
- What do I do next?

## Organizer Role

Organizers act as gamemasters. They can keep the pacing on track, confirm arrivals when GPS is noisy, and decide when optional story beats or extra tasks are triggered.

## Open Questions

- Should reward tables be fixed per location or adjustable in content files?
- Should some locations require only arrival while others require arrival plus a roll?
- Should the organizer be able to pause a location if Matthew arrives too early?

## Future Improvements

- Story branches between locations.
- Pacing tools for organizers.
- Difficulty presets for different route lengths.
- Replayable route packs.

## Related Documents

- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Feature 1 Plan](./Feature1Plan.md)
