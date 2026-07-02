# Resources

## Purpose

Define how player resources should be modeled, displayed, changed, and protected from bookkeeping errors.

## Goals

- Make resource counts easy to update on a phone.
- Keep changes traceable in game history.
- Support trades, bonuses, penalties, attacks, and defenses.
- Avoid direct coupling to copyrighted commercial terminology.

## MVP Resource Model

Use generic or original resource names for the MVP ruleset. Each resource should have:

- Stable ID.
- Display name.
- Short label.
- Color token.
- Optional icon key.

Each player stores resource quantities by resource ID. Quantities should never go below zero unless a specific ruleset permits debt.

## Resource Change Sources

- Manual adjustment.
- Dice event.
- Bonus.
- Penalty.
- Trade settlement.
- Attack/defense resolution.
- Admin correction.

## UX Requirements

- Large tap targets for increment and decrement.
- Clear current count.
- Confirmation only for destructive multi-resource changes.
- Immediate history record for every committed change.

## Open Questions

- Should the MVP support hidden resources?
- Should resource limits exist?
- Should negative resources ever be allowed as debt?

## Future Improvements

- Custom resource sets.
- Resource icons.
- Bank inventory tracking.
- Trade recommendation engine.

## Related Documents

- [Kingdom](./Kingdom.md)
- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [UX](./UX.md)

