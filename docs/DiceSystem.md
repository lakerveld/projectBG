# Dice System

## Purpose

Define how physical dice are entered for the Antwerp journey.

## Goals

- Support manual entry for physical dice.
- Make each roll auditable in the journey log.
- Keep the dice result tied to the active location.
- Keep validation simple enough for live use on the street.

## MVP Design

The first feature should store each dice action with:

- Roll value.
- Location ID.
- Timestamp.
- Activation source.
- Resulting reward or effect ID.

Manual entry is the default because the app enhances a physical journey and Matthew rolls the dice in real life.

The first slice uses total-only entry. Matthew rolls physical dice and enters a total from 2 to 12. Individual die values are deferred.

## Validation

- Two six-sided dice imply valid totals from 2 to 12.
- Invalid entries should be blocked with clear feedback.
- Dice entry should only be available when a location is active.
- Duplicate submissions should be safely ignored or corrected through history.

## Open Questions

- Should a location accept more than one roll, or only one roll per arrival?
- Should the app store individual die values in a later version?
- Should the organizer be able to log the roll on Matthew's behalf?

## Future Improvements

- Animated dice roller.
- Seeded route sessions.
- Probability display.
- Special dice profiles for future story packs.

## Related Documents

- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [Game Design](./GameDesign.md)
- [State Management](./StateManagement.md)
- [Feature 1 Plan](./Feature1Plan.md)
