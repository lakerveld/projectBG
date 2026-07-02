# Sprint 4

## Purpose

Plan the first Round 1 gameplay slice after King selection.

## Goals

- Enter the first physical dice result.
- Validate dice totals.
- Record dice results in history.
- Preserve the physical-board-first experience.
- Keep world events simple or deferred until dice entry is reliable.

## Scope

- Add dice result entry after game start. Status: started.
- Validate dice totals. Status: started.
- Record dice result history. Status: started.
- Show current round and first-turn player. Status: started.
- Decide whether resource and momentum updates are implemented or stubbed. Answer: deferred.
- Keep world event checks behind a clearly marked placeholder if not implemented. Status: started.
- Add unit tests for dice validation. Status: started.

## Out of Scope

- Full random events.
- Full resource production rules.
- Trading.
- Attack/defense.
- Bonuses and penalties.
- App Store work.
- Supabase.

## Definition of Done

- A started game shows round 1 and the King as first-turn player.
- A dice total can be entered.
- Invalid dice totals are rejected.
- Dice entry is recorded in history.
- World event handling is either implemented narrowly or visibly deferred.

## Open Questions

- Should dice be entered as total only or as two individual dice? Answer: total only for Sprint 4.
- Should resources update immediately in Sprint 4 or wait for a dedicated resource sprint? Answer: wait for a dedicated resource sprint.
- Should world events be checked but not resolved yet? Answer: mark world events as deferred in dice history metadata.

## Future Improvements

- Round-average world events in [Sprint 5](./Sprint5.md).
- Resource gameplay expansion.
- Trade flow.
- Attack/defense mechanics.
- End-game and recap flows.

## Related Documents

- [Sprint 3](./Sprint3.md)
- [Roadmap](./Roadmap.md)
- [Backlog](./Backlog.md)
- [Dice System](./DiceSystem.md)
- [UX](./UX.md)
- [Dice Entry Spec](../specs/dice-entry.md)
- [Sprint 5](./Sprint5.md)
