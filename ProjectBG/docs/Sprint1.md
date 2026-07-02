# Sprint 1

## Purpose

Define the first implementation sprint after the project foundation is accepted.

## Goals

- Initialize the technical stack.
- Build a non-final app shell.
- Prove local state and persistence direction with a thin vertical slice.
- Keep mechanics simple and testable.

## Proposed Scope

- Initialize Next.js, TypeScript, React, and TailwindCSS. Status: started.
- Add ESLint, formatting, import aliases, and basic scripts. Status: started.
- Create route skeletons for setup, game dashboard, history, and settings. Status: started.
- Add base UI components and theme tokens. Status: started.
- Implement minimal domain types for games, players, resources, and history. Status: started.
- Spike local persistence with IndexedDB/Dexie. Status: started.
- Add initial unit tests for a resource adjustment command. Status: started.

## Out of Scope

- Full game mechanics.
- App Store wrapper.
- Supabase.
- Authentication.
- Final visual design.

## Definition of Done

- App runs locally.
- Mobile-first shell displays on a phone viewport.
- One thin state transition is implemented and tested.
- Persistence spike can save and reload a sample game.
- Architecture assumptions are updated in [Decisions](./Decisions.md).

## Open Questions

- Should the first slice be resource tracking or game setup? Answer: resource tracking.
- Should UI components be built directly or documented with Storybook/Ladle later?
- Should persistence spike use a real migration from day one? Answer: yes, start with Dexie schema version 1.

## Future Improvements

- Add Playwright golden path test.
- Add design review screenshots.
- Add CI pipeline.
- Continue with game creation in [Sprint 2](./Sprint2.md).

## Related Documents

- [Roadmap](./Roadmap.md)
- [Backlog](./Backlog.md)
- [Architecture](./Architecture.md)
- [Tech Stack](./TechStack.md)
- [Coding Standards](./CodingStandards.md)
- [Sprint 2](./Sprint2.md)
