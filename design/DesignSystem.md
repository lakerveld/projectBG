# Design System

## Purpose

Define the visual and interaction system for the Antwerp journey.

## Goals

- Create a clear route-first interface.
- Use consistent spacing, color, type, and controls.
- Support walking and quick glances rather than dense admin work.
- Leave room for stronger brand expression later.

## Design Direction

The interface should feel like a practical expedition dashboard: tactile, readable, and energetic without becoming visually noisy. It should avoid generic game dashboards and should not look like a direct clone of other board-game apps.

## Typography

- Use a readable sans-serif for UI.
- Use compact headings for panels and route states.
- Avoid oversized marketing typography inside the app.
- Keep labels short because the phone may be used outdoors.

## Spacing

- Base spacing unit: 4px.
- Common gaps: 8px, 12px, 16px, 24px.
- Tap targets: 44px minimum.
- Cards and panels: 8px radius or less unless later testing suggests otherwise.

## Interaction Patterns

- Map pins for locations.
- Bottom sheets for active locations.
- Chips for resource counts.
- Single-purpose confirm actions for dice and arrival.
- Status pills for GPS and location state.

## Accessibility

- Maintain strong color contrast.
- Do not rely on color alone for location status.
- Support large tap targets.
- Use clear focus states.
- Avoid tiny labels on resource controls.

## Open Questions

- Should the app support a dedicated high-contrast outdoor mode?
- Should location colors be customizable?
- Should the visual style lean more map-like, expedition-like, or utility-like?

## Future Improvements

- Add component examples.
- Add typography tokens.
- Add motion guidelines.
- Add accessibility audit checklist.

## Related Documents

- [Color Palette](./ColorPalette.md)
- [Components](./Components.md)
- [Wireframes](./Wireframes.md)
- [UX](../docs/UX.md)
