# Components

## Purpose

List the expected UI components for the MVP and establish early component boundaries.

## Goals

- Encourage reusable, focused components.
- Prevent route files from becoming large and brittle.
- Support consistent mobile interactions.
- Prepare for later visual documentation.

## Core UI Components

- Button.
- IconButton.
- Modal or Drawer.
- BottomSheet.
- SegmentedControl.
- NumberStepper.
- ResourceBadge.
- PlayerAvatar.
- StatusPill.
- TimelineItem.
- EmptyState.
- ConfirmAction.

## Feature Components

- CreateGameForm.
- PlayerSetupList.
- PlayerColorPicker.
- GameDashboard.
- KingdomSummary.
- KingdomDetail.
- DiceEntry.
- EventResolutionPanel.
- TradeBuilder.
- AttackDefenseResolver.
- GameHistoryList.

## Component Rules

- Keep domain calculations out of visual components.
- Prefer typed props.
- Keep mobile layout behavior explicit.
- Avoid deeply nested card layouts.
- Use icons for repeated commands where a standard icon exists.

## Open Questions

- Should feature components live under `components/features` or colocate with routes?
- Should a component explorer be added after Sprint 1?
- Should modals or bottom sheets be the default mobile pattern?

## Future Improvements

- Add component acceptance criteria.
- Add screenshots or Storybook stories.
- Add accessibility notes per component.

## Related Documents

- [Design System](./DesignSystem.md)
- [Wireframes](./Wireframes.md)
- [UX](../docs/UX.md)
- [Coding Standards](../docs/CodingStandards.md)

