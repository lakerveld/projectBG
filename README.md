# ProjectBG

ProjectBG is the working repository for **Ketanisten van Rattan**, a mobile-first Antwerp journey app for Matthew. The phone acts as a route companion: it shows the map, detects or confirms arrival at locations, accepts physical dice input, resolves location rewards, and keeps the resource ledger locally.

## Tech Stack

- Next.js
- TypeScript
- React
- TailwindCSS
- Zustand for MVP client state
- IndexedDB, likely through Dexie, for local persistence
- Vitest and Playwright for testing once implementation starts

Future candidates:

- Supabase for optional cloud backup and sync
- Native iOS wrapper, likely Capacitor, if the web MVP validates
- App Store deployment

## Folder Structure

- `app`: Next.js routes and route-level layouts.
- `components`: reusable UI and feature components.
- `lib`: domain logic, state, storage, API boundaries, and utilities.
- `public`: static assets.
- `docs`: product, architecture, planning, and engineering documentation.
- `design`: wireframes, design system, palette, and component planning.
- `specs`: implementation-ready feature specifications.
- `prompts`: prompt libraries for Claude, Codex, Lovable, and Midjourney.

## Getting Started

This repository is currently in planning and documentation mode for feature 1. Feature implementation has intentionally not started yet.

When implementation begins:

1. Install a modern Node.js runtime. The project expects Node 20 or newer.
2. Install dependencies with `npm install`.
3. Run the local app with `npm run dev`.
4. Run checks with `npm run typecheck`, `npm run lint`, and `npm test`.
5. Keep domain rules in `lib/domain` and UI composition in `app` and `components`.

## Development Workflow

1. Start from a backlog item in [Backlog](./docs/Backlog.md).
2. Confirm the relevant docs and open questions.
3. Add or update a spec in `specs` for work with meaningful behavior.
4. Implement the smallest useful slice.
5. Add tests for domain logic and critical flows.
6. Update documentation and decisions when assumptions change.

## Branch Strategy

Use short, descriptive branches with a type prefix:

- `docs/project-foundation`
- `feat/antwerp-map`
- `feat/location-activation`
- `feat/dice-resolution`
- `fix/location-validation`
- `chore/tooling`

Main branch should stay releasable once implementation begins. Feature branches should be merged through pull requests with test and manual verification notes.

## Documentation Links

- [Vision](./docs/Vision.md)
- [Feature 1 Plan](./docs/Feature1Plan.md)
- [Roadmap](./docs/Roadmap.md)
- [MVP](./docs/MVP.md)
- [Architecture](./docs/Architecture.md)
- [Game Design](./docs/GameDesign.md)
- [Mechanics](./docs/Mechanics.md)
- [Dice System](./docs/DiceSystem.md)
- [Resources](./docs/Resources.md)
- [Journey Overview](./docs/Kingdom.md)
- [Events](./docs/Events.md)
- [Player Flow](./docs/PlayerFlow.md)
- [UX](./docs/UX.md)
- [Database](./docs/Database.md)
- [State Management](./docs/StateManagement.md)
- [Tech Stack](./docs/TechStack.md)
- [Coding Standards](./docs/CodingStandards.md)
- [Backlog](./docs/Backlog.md)
- [Sprint 0](./docs/Sprint0.md)
- [Sprint 1](./docs/Sprint1.md)
- [Sprint 2](./docs/Sprint2.md)
- [Sprint 3](./docs/Sprint3.md)
- [Sprint 4](./docs/Sprint4.md)
- [Sprint 5](./docs/Sprint5.md)
- [Decisions](./docs/Decisions.md)
- [Wireframes](./design/Wireframes.md)
- [Design System](./design/DesignSystem.md)
- [Color Palette](./design/ColorPalette.md)
- [Components](./design/Components.md)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
