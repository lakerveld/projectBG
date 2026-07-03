# Kingdom

## Purpose

Define the player-facing dashboard concept used to summarize each player's state during the game.

## Goals

- Give every player a clear status view.
- Make resource, bonus, penalty, attack, and defense state scannable.
- Support shared-screen use on one phone.
- Avoid requiring private player screens in the MVP.

## MVP Kingdom Dashboard

Each player dashboard should show:

- Player name and color.
- King marker when the player is currently crowned King.
- First-turn marker when the player starts round 1.
- Resource counts.
- Active bonuses.
- Active penalties.
- Defense status.
- Recent history affecting that player.
- Optional score/progress summary if the ruleset needs it.

## Interaction Model

The dashboard should be optimized for quick table updates:

- Tap a player to focus their kingdom.
- Use compact controls to adjust resources.
- Show active effects with expiration or usage count.
- Provide direct actions for trade, attack, defense, and notes.
- Highlight the King's capital clearly without relying on color alone.

## Open Questions

- Should dashboards be arranged as tabs, cards, or a rotating carousel?
- How much recent history should appear before the screen becomes crowded?
- Should one player be designated active at all times?
- Should the King marker persist beyond round 1 or become historical after the first turn?

## Future Improvements

- Player portraits or icons.
- Private reveal mode.
- Long-term kingdom progression.
- Comparative table view.

## Related Documents

- [Resources](./Resources.md)
- [Player Flow](./PlayerFlow.md)
- [UX](./UX.md)
- [Design System](../design/DesignSystem.md)
