# Components

## Purpose

List the expected UI components for the Antwerp journey and establish early component boundaries.

## Goals

- Encourage reusable, focused components.
- Prevent route files from becoming large and brittle.
- Support consistent mobile interactions.
- Prepare for later visual documentation.

## Core UI Components

- Button.
- IconButton.
- BottomSheet.
- Modal.
- SegmentedControl.
- ResourceBadge.
- StatusPill.
- MapPin.
- LocationCard.
- DiceEntry.
- JourneyProgress.
- ResourceLedger.
- EmptyState.
- ConfirmAction.

## Feature Components

- StartJourneyScreen.
- AntwerpMapView.
- CurrentLocationSheet.
- GPSStatusPill.
- DiceResultPanel.
- ResourceUpdatePanel.
- JourneyHistoryList.

## Component Rules

- Keep domain calculations out of visual components.
- Prefer typed props.
- Keep mobile layout behavior explicit.
- Avoid deeply nested card layouts.
- Use icons for repeated commands where a standard icon exists.

## Open Questions

- Should feature components live under `components/features` or colocate with routes?
- Should a component explorer be added after the map slice stabilizes?
- Should bottom sheets or full screens be the default pattern for active locations?

## Future Improvements

- Add component acceptance criteria.
- Add screenshots or Storybook stories.
- Add accessibility notes per component.

## Related Documents

- [Design System](./DesignSystem.md)
- [Wireframes](./Wireframes.md)
- [UX](../docs/UX.md)
- [Feature 1 Plan](../docs/Feature1Plan.md)
