# Player Flow

## Purpose

Describe the expected table flow from opening the app through completing a local game.

## Goals

- Minimize setup time.
- Keep the phone useful without becoming the center of attention.
- Make correction and review flows obvious.
- Support shared-device ergonomics.

## MVP Flow

- **Open the app**
- **Tap "Create Game"**
- **Step 1: Add players**
  - Enter each player's name.
  - Choose a player color.
  - Each added player receives a random fantasy avatar.
  - The selected player color frames that avatar.
- **Continue to King selection**
- **Step 2: Review players**
  - Confirm everyone has joined.
- **Random King Selection**
  - The app plays a short animation.
  - One player is randomly crowned **The King**.
  - The King receives the **First Turn** marker.
- **Continue to game**
  - The Kingdom view highlights the King's capital with a crown.
- **Begin Round 1**
  - The King rolls the physical dice.
  - The dice result is entered into the app.
  - Sprint 4 records the dice result.
  - When every player has rolled, the app opens a full-screen world event reveal.
  - Players read the event, then continue back to the game dashboard.
  - After every 3 completed rounds, the app pauses before the next roll and opens Crown Selection.
  - The app automatically crowns a new King from players who have not ruled yet in the current cycle.
  - The previous King cannot be selected immediately again.
  - Once everyone has had one King turn, the rotation pool resets and a new cycle begins.
  - Resource updates and momentum are deferred until later gameplay sprints.
  - Play continues clockwise following the normal Catan-inspired table rules.

## Later Gameplay Flow

1. Review starting kingdoms.
2. During turns, enter dice rolls and apply resulting events.
3. Update resources, trades, bonuses, penalties, attacks, and defenses.
4. Review history when disputes or mistakes happen.
5. End or archive game locally.

## Screen Step Pattern

Each major table action should live on its own screen:

- One screen gathers the required input.
- The next screen confirms or resolves the result.
- The following screen begins the next step of play.

This keeps the phone easy to pass around and prevents one screen from becoming a dense control panel.

## Error Recovery

The app must assume players will make mistakes under table pressure. Recovery options should include:

- Undo last action where technically safe.
- Add correction entry with reason.
- Edit player resource counts with history note.
- View recent changes by player.

## Open Questions

- Should setup include a rules explanation screen?
- Should there be a dedicated active-player selector? Deferred until gameplay work resumes.
- Should ending a game require confirmation?
- Should King selection be skippable or replayable before round 1 begins?

## Future Improvements

- Resume multiple games.
- Onboarding for custom rule packs.
- Session recap screen.
- Exportable game summary.

## Related Documents

- [MVP](./MVP.md)
- [UX](./UX.md)
- [Kingdom](./Kingdom.md)
- [Game Design](./GameDesign.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
