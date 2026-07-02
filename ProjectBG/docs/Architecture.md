# Architecture

## Purpose

Define the initial technical architecture for a maintainable, testable, mobile-first Next.js application that starts local-only and can later grow into a cloud-backed product.

## Goals

- Keep domain rules independent from React components.
- Support local persistence with versioned migrations.
- Make state transitions auditable through history.
- Keep the app installable and wrapper-friendly later.
- Avoid backend assumptions during MVP.

## Recommended Architecture

### Application Framework

Use Next.js with the App Router, TypeScript, React, and TailwindCSS.

Why: Next.js gives a production-grade React foundation, file-based routing, static export options, and an easy future path to API routes if backend endpoints become useful. The App Router is the current direction of the framework and works well with isolated client components for local interactivity.

### State Management

Use Zustand for app-level client state, with pure TypeScript reducers or command handlers for game-domain transitions.

Why: the MVP is a client-heavy shared-device app. Zustand is small, ergonomic, and avoids the boilerplate of Redux while still supporting predictable stores, selectors, and persistence integration. Domain logic should not live directly inside components; keeping command handlers pure makes mechanics testable and easier to migrate to another runtime later.

### Local Persistence

Use IndexedDB through a thin repository layer. Dexie is recommended once implementation begins.

Why: localStorage is simple but weak for structured, versioned game records and larger history logs. IndexedDB is browser-native and more durable for offline-first state. Dexie reduces ceremony while still allowing migrations.

### Game State Model

Prefer an action/history model where every meaningful mutation records an event.

Why: tabletop sessions require correction and explanation. A history-first model supports undo, audit trails, debugging, and later analytics without needing to reverse-engineer state changes.

### API Layer

Create a `lib/api` boundary even before a remote API exists. During MVP, it should expose local repositories and domain services.

Why: this prevents React components from coupling directly to storage choices. If Supabase is introduced later, the API boundary can swap implementations without rewriting screens.

### Folder Organization

- `app`: Next.js routes and route-level layouts.
- `components`: reusable UI and feature components.
- `lib/domain`: pure game models, rules, commands, validation, and calculations.
- `lib/state`: Zustand stores and selectors.
- `lib/storage`: local persistence repositories and migrations.
- `lib/api`: app-facing service boundary.
- `specs`: implementation specs and feature contracts.
- `docs`: planning and architecture documentation.
- `design`: design system and UX artifacts.

### Testing Strategy

- Unit test domain rules, reducers, event generation, resource math, and migrations.
- Component test critical shared controls and dashboard states.
- End-to-end test the golden path: create game, add players, enter roll, trigger event, trade, persist, reload.

Why: the highest-risk logic is not rendering; it is state correctness during a live table session. Tests should protect that first.

### Future Scalability

Use clear boundaries around domain, persistence, and UI. Avoid putting Supabase types or server assumptions into domain models.

Why: the MVP should remain fast to build, but the code should not trap future native or cloud work behind tangled client state.

## Open Questions

- Should the MVP use event sourcing as the primary store or store snapshots plus action history?
	- Snapshots plus action history
- Should route-level state restore from storage automatically or through an explicit resume screen?
	- explicit resume screen.
- Which test runner should be selected during implementation: Vitest, Playwright, or both?
	- For MVP Vitest, later on both.


## Future Improvements

- Supabase-backed optional sync.
- Server-side rule validation for shared cloud games.
- Native wrapper with filesystem-backed export/import.
- Feature flags for experimental mechanics.

## Related Documents

- [State Management](./StateManagement.md)
- [Database](./Database.md)
- [Tech Stack](./TechStack.md)
- [Coding Standards](./CodingStandards.md)
- [Decisions](./Decisions.md)

