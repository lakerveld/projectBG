# Sprint 5

## Purpose

Implement the first world-event slice after dice entry.

## Goals

- Store one roll per player during a round.
- Advance the current turn player after each dice entry.
- Calculate the round average after every player has rolled once.
- Apply one global world event based on the average.
- Record the event in history.

## Scope

- Track current round rolls. Status: started.
- Rotate current turn through the player list. Status: started.
- Calculate average roll at round end. Status: started.
- Categorize the round as negative, neutral, or positive. Status: started.
- Apply one MVP world event from the matching category. Status: started.
- Store the active world event. Status: started.
- Reset round rolls and advance to the next round. Status: started.
- Add unit tests for event category and round completion. Status: started.

## Out of Scope

- Player-targeted events.
- Real resource production effects.
- Real trade effects.
- Real build-cost effects.
- Event deck editing.
- Event duration countdown.

## Definition of Done

- Every player can roll once in a round.
- The app shows round roll progress.
- The round average is calculated when all players have rolled.
- A global event is selected by average category.
- The world event appears on the dashboard.
- History includes both the final dice roll and world event entry.
- Unit tests cover neutral event selection at average 7.

## Open Questions

- Should the next round always start with the King or continue clockwise from the final player? Answer: start with the King for now.
- Should active world events expire automatically after one round? Answer: not yet; duration countdown is future work.
- Should world event details become a dedicated screen later?

## Future Improvements

- Multiple event options per category.
- Seeded event selection.
- Event duration resolution.
- Real effects for resources, trades, and building costs.

## Related Documents

- [Sprint 4](./Sprint4.md)
- [Events](./Events.md)
- [Dice System](./DiceSystem.md)
- [Backlog](./Backlog.md)
