# Resources

## Purpose

Define how Matthew's journey resources should be modeled and displayed.

## Goals

- Make the current resource state easy to read on a phone.
- Keep every change traceable in the journey log.
- Tie resource changes back to a location and dice result.
- Avoid terms that depend on other board games.

## MVP Resource Model

Each resource should have:

- Stable ID.
- Display name.
- Short label.
- Color token.
- Optional icon key.

Matthew stores resource quantities by resource ID. Quantities should not go below zero unless a later rule explicitly allows that.

## Resource Change Sources

- Location reward.
- Intermission task.
- Manual correction.
- Future story beat.

## UX Requirements

- Large tap targets for changes.
- Clear current count.
- A visible total ledger.
- Immediate history record for every committed change.

## Open Questions

- Should resources be generic or themed per Antwerp route?
- Should any resource be hidden from Matthew?
- Should the app allow temporary bonus resources?

## Future Improvements

- Route-specific resource sets.
- Resource icons.
- Progress summaries.
- Future exchange or cost systems.

## Related Documents

- [Journey Overview](./Kingdom.md)
- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [UX](./UX.md)
