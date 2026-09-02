# Future Story Beats

## Problem

The first feature should stay focused on map, arrival, dice, and resources, but the project will eventually need optional prompts between locations.

## Scope

- Define positive, tactical, and negative story beats for later.
- Allow the organizer to trigger a beat.
- Keep the beat separate from the core location loop.

## User Flow

1. Matthew completes a location.
2. The organizer triggers a beat.
3. The app shows the beat.
4. Matthew responds.
5. The result is added to the journey log.

## Domain Behavior

- Story beats should not be required for the first feature.
- A beat can be tied to a location, route segment, or special stop.
- Beat outcomes should be stored in history.

## Data Shape

See [Feature 1 Plan](../docs/Feature1Plan.md) and [Events](../docs/Events.md).

## Acceptance Criteria

- The beat system is clearly deferred from feature 1.
- The docs define a future structure for route prompts.
- The beat flow stays separate from arrival and reward logic.

## Test Notes

- Tests are not required for the deferred feature yet.
- When implemented, tests should cover organizer trigger and logged result.

## Related Docs

- [Feature 1 Plan](../docs/Feature1Plan.md)
- [Events](../docs/Events.md)
- [Roadmap](../docs/Roadmap.md)
