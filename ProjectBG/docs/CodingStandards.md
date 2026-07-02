# Coding Standards

## Purpose

Define engineering conventions so the project remains consistent as it grows.

## Goals

- Make code easy to navigate.
- Keep domain logic testable.
- Reduce naming drift.
- Establish clear Git and review habits.

## Naming

- Components: `PascalCase`, for example `PlayerDashboard`.
- Hooks: `useCamelCase`, for example `useGameStore`.
- Types and interfaces: `PascalCase`, for example `GameState`.
- Functions and variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Files: component files use `PascalCase.tsx`; utilities use `camelCase.ts`.

## Components

- Keep route components thin.
- Put reusable UI in `components/ui`.
- Put feature-specific components in `components/features/<feature>`.
- Avoid embedding domain rules in JSX.
- Prefer explicit props over broad object passing unless the component truly renders a whole domain object.

## Hooks

- Hooks should orchestrate UI state or store access.
- Hooks should not contain complex game rules.
- Reusable hooks belong in `lib/hooks` or feature folders if scoped.

## Folder Organization

- `app`: routes, layouts, route loading/error states.
- `components`: reusable UI and feature components.
- `lib/domain`: models, commands, rules, event generation.
- `lib/state`: stores and selectors.
- `lib/storage`: persistence adapters and migrations.
- `lib/api`: service boundary.
- `specs`: feature contracts before implementation.

## Commits

Use concise conventional-style commits:

- `docs: add MVP architecture plan`
- `feat: add game creation flow`
- `fix: prevent negative resource balances`
- `test: cover dice event generation`

## Branches

Use short branch names with a type prefix:

- `docs/project-foundation`
- `feat/game-setup`
- `fix/resource-validation`
- `chore/tooling`

## Pull Requests

Each PR should include:

- What changed.
- Why it changed.
- Screenshots or recordings for UI work.
- Test coverage or manual verification notes.
- Known limitations.

## TypeScript

- Prefer explicit domain types.
- Avoid `any`; use `unknown` at boundaries and narrow it.
- Use discriminated unions for command and event types.
- Keep storage DTOs separate from domain models when migrations matter.
- Validate external or persisted data before trusting it.

## Comments

- Comment why something exists when the reasoning is not obvious.
- Do not restate simple code.
- Add short notes around non-obvious game balance or migration decisions.

## Open Questions

- Should ESLint and Prettier be enforced in CI from Sprint 1?
- Should import aliases use `@/` from the beginning?
- Should PR templates be added now or after the first implementation sprint?

## Future Improvements

- Add automated lint, format, and test checks.
- Add architecture decision linting through docs review.
- Add Storybook or Ladle for component review if UI complexity grows.

## Related Documents

- [Architecture](./Architecture.md)
- [Tech Stack](./TechStack.md)
- [Decisions](./Decisions.md)
- [Sprint 1](./Sprint1.md)

