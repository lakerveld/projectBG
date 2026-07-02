# Roadmap

## Purpose

Describe a staged delivery plan from repository setup through MVP validation and future App Store readiness.

## Goals

- Keep early work focused on a usable local MVP.
- Avoid premature cloud, account, or native complexity.
- Create clear checkpoints for design, implementation, testing, and validation.
- Maintain a backlog that separates MVP value from future expansion.

## Phase 0: Foundation

- Create repository structure, documentation, and planning.
- Define architecture decisions and coding standards.
- Establish MVP scope and risk register.
- Prepare prompt folders for assisted design and implementation workflows.

## Phase 1: Static Product Skeleton

- Initialize Next.js, TypeScript, React, and TailwindCSS.
- Add base app shell, route structure, responsive layout primitives, and theme tokens.
- Create non-functional UI screens for create game, players, dashboard, history, and settings.
- Add local component documentation.

## Phase 2: Setup MVP

- Implement game creation and player setup on one screen.
- Store setup progress locally through a versioned persistence layer.
- Review players, start the game, and randomly select the King.
- Validate the setup flow on a mobile viewport.

## Phase 3: Gameplay MVP

- Add dice roll entry, round-average world events, resource tracking, bonuses, penalties, and history.
- Add undo-friendly command history for core actions.
- Add trading and attack/defense only after setup and first-turn flow are stable.

## Phase 4: Table Play Validation

- Test on actual mobile devices.
- Validate shared-screen readability and tap targets.
- Run tabletop sessions and collect friction points.
- Tune setup, event frequency, resource language, and correction flows.

## Phase 5: MVP Hardening

- Add automated tests for reducers, persistence, and rule logic.
- Add accessibility pass.
- Add import/export backup.
- Improve performance and state migration.
- Prepare demo build.

## Phase 6: Future Platform Work

- Evaluate Supabase for optional backup and analytics.
- Evaluate Capacitor or Expo wrapper for App Store distribution.
- Add native persistence, app icons, splash screens, and offline behavior checks.
- Prepare privacy documentation.

## Open Questions

- What is the minimum table session length needed to validate the MVP?
- Should local games be recoverable after browser cache clearing through export files?
- What metrics can be collected ethically without accounts?

## Future Improvements

- Campaign mode.
- Multi-game templates.
- Shared device handoff.
- Cloud sync with opt-in accounts.

## Related Documents

- [Backlog](./Backlog.md)
- [Sprint 0](./Sprint0.md)
- [Sprint 1](./Sprint1.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
- [Sprint 5](./Sprint5.md)
- [Architecture](./Architecture.md)
- [Decisions](./Decisions.md)
