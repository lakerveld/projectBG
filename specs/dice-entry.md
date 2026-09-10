# Dice Entry

## Problem

Matthew needs a fast way to enter a physical dice total after arriving at a location.

## Scope

- Accept a total-only dice result from 2 to 12.
- Validate the entry.
- Attach the roll to the active location.
- Record the roll in the journey history.

## User Flow

1. A location becomes active.
2. Matthew rolls physical dice.
3. The total is entered in the app.
4. The app validates the number.
5. The app resolves the location reward.

## Domain Behavior

- Dice entry is only allowed when a location is active.
- Only totals from 2 to 12 are valid.
- A valid roll should produce one history entry.
- The roll should be linked to the active location ID.

## Data Shape

See [Feature 1 Plan](../docs/Feature1Plan.md) and [Dice System](../docs/DiceSystem.md).

## Acceptance Criteria

- Valid totals are accepted.
- Invalid totals are rejected.
- The active location can be resolved from the roll.
- The journey log shows the roll and its result.

## Test Notes

- Unit tests should cover valid totals, invalid totals, and no-active-location rejection.
- End-to-end tests should cover the complete arrival-to-roll path.

## Related Docs

- [Feature 1 Plan](../docs/Feature1Plan.md)
- [Player Flow](../docs/PlayerFlow.md)
- [Mechanics](../docs/Mechanics.md)

## Current prototype reward flow

After confirming a roll, show a dedicated illustrated reward screen. The temporary table approved for the prototype awards one resource: 2–4 Bier, 5–6 Salmiak, 7–9 Poedersuiker, 10–12 Eten. Total score is the sum of all four resource quantities. Animate the increase and display the updated inventory before returning to the map. Respect reduced-motion preferences.

The inventory persists in browser localStorage under `rattan-journey-inventory`. This prototype does not yet gate rolls by location or attach them to journey history; those remain future integration work.
