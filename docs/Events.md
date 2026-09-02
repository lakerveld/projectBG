# Events

## Purpose

Define the future story-beat system for the Antwerp journey.

## Core Rule

Feature 1 does not need full event branching yet. Future story beats can appear between locations or after a special stop, but the first playable slice should focus on arrival, dice, and resource updates.

## Goals

- Keep future story beats readable on one phone.
- Allow the organizer to trigger a prompt when needed.
- Keep optional prompts separate from the core location loop.
- Record any future beat in the journey log.

## Future Beat Flow

1. Matthew completes a location.
2. The organizer triggers a story beat or task.
3. The app shows the beat on its own screen or sheet.
4. Matthew follows the prompt.
5. The app records the result in the journey log.

## Beat Categories

- Positive.
- Tactical.
- Negative.

## Event Structure

```ts
{
  id: string;
  name: string;
  description: string;
  trigger: "between_locations" | "special_stop";
  category: "positive" | "tactical" | "negative";
  targeting: "Matthew" | "global";
  duration: "instant" | "1_stop" | "route";
  effectsApplied: string[];
}
```

## Open Questions

- Should story beats be visible before Matthew reaches a stop?
- Should the organizer choose the beat from a fixed pool or from route content?
- Should some beats require a dice roll and others not?

## Future Improvements

- Beat deck editing.
- Duration countdown.
- Route-specific beat pools.
- Full-screen reveal art.

## Related Documents

- [Dice System](./DiceSystem.md)
- [Mechanics](./Mechanics.md)
- [Game Design](./GameDesign.md)
- [Feature 1 Plan](./Feature1Plan.md)
