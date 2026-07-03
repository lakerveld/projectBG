# UX

## Purpose

Define user experience principles and mobile-first interaction expectations for the shared-phone table context.

## Goals

- Make the app usable at arm's length on a table.
- Prioritize speed and clarity over dense configuration.
- Avoid account prompts and blocking setup.
- Keep the first playable flow narrow enough to test at the table.

## UX Principles

- One decision per screen when possible.
- Large, thumb-friendly controls.
- High contrast for table lighting.
- Clear player colors.
- Player identity should combine name, color, and avatar so players are not identified by color alone.
- Immediate feedback for setup and turn state changes.
- Defer secondary tools until they clearly support the table flow.

## Primary Screens

- Home or resume screen.
- Create game.
- Player setup inside create game.
- Review players.
- Random King selection.
- Game dashboard.
- Dice entry.
- Event resolution.

Deferred screens:

- Player kingdom dashboard with resources.
- Trade flow.
- Attack/defense flow.
- History.
- Settings/ruleset summary.

## Mobile-First Requirements

- Design for 390px wide screens first.
- Tap targets should be at least 44px.
- Avoid hover-only interactions.
- Keep core actions reachable near the bottom.
- Use responsive layouts for larger phones and tablets.

## Open Questions

- Should the app use portrait only, or support landscape tabletop mode?
	- Portrait for now
- Should controls be optimized for one person operating the phone or passed-around usage?
	- Passed around usage. 
- Should history be a persistent panel or a separate screen?
	- Deferred until history returns to scope.
- Should the King selection animation be skippable?

## Future Improvements

- Tablet tabletop layout.
- Accessibility settings.
- Voice prompts.
- Haptic feedback in native wrapper.

## Related Documents

- [Player Flow](./PlayerFlow.md)
- [Kingdom](./Kingdom.md)
- [Wireframes](../design/Wireframes.md)
- [Design System](../design/DesignSystem.md)
