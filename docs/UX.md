# UX

## Purpose

Define the experience rules for the Antwerp journey on a phone.

## Goals

- Make the app usable while walking.
- Prioritize route clarity over dense configuration.
- Avoid account prompts and multi-step setup.
- Keep the first playable flow narrow enough to test outside.

## UX Principles

- One decision per screen when possible.
- Large, thumb-friendly controls.
- High contrast in daylight.
- Clear journey state at the top of the screen.
- The map, active location, and resource change should always feel connected.
- Defer secondary tools until they clearly support the route flow.

## Primary Screens

- Resume or start journey.
- Antwerp map.
- Active location sheet.
- Dice entry.
- Resource update confirmation.

Deferred screens:

- Story beat browser.
- Route history.
- Organizer tools.
- Route settings.

## Mobile-First Requirements

- Design for 390px wide screens first.
- Tap targets should be at least 44px.
- Avoid hover-only interactions.
- Keep core actions reachable near the bottom.
- Use responsive layouts for larger phones and tablets.

## Open Questions

- Should the app use portrait only, or also support landscape while walking?
- Should controls be optimized for Matthew only or for organizer handoff too?
- Should route history be persistent or separate?

## Future Improvements

- Tablet route mode.
- Accessibility settings.
- Voice prompts.
- Haptic feedback in a native wrapper.

## Related Documents

- [Player Flow](./PlayerFlow.md)
- [Journey Overview](./Kingdom.md)
- [Feature 1 Plan](./Feature1Plan.md)
- [Design System](../design/DesignSystem.md)
