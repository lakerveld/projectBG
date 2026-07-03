# Tech Stack

## Purpose

Document the selected technology stack, why it fits the MVP, and what should be deferred.

## Goals

- Use a modern web stack suitable for mobile-first development.
- Keep the MVP offline-capable and local-first.
- Preserve a path to App Store deployment.
- Avoid overengineering before playtesting.

## Selected Stack

- Next.js for application framework.
- TypeScript for type safety.
- React for component UI.
- TailwindCSS for styling.
- Zustand for client state.
- IndexedDB with Dexie for local persistence.
- Vitest for unit tests.
- Playwright for end-to-end tests.

## Why This Stack

Next.js supports production React workflows and future backend routes. TypeScript protects domain logic and refactors. TailwindCSS speeds consistent mobile UI work. Zustand fits local interactive state without excess ceremony. IndexedDB supports offline game records. Vitest and Playwright cover the domain and table-flow risks.

## Deferred Stack

- Supabase: defer until cloud backup or sync is needed.
- Native wrapper: defer until the web MVP proves useful.
- Authentication: defer until user-owned cloud data exists.
- Analytics: defer until privacy and playtest goals are defined.

## Open Questions

- Should the initial app be configured for static export?
- Should package management use npm, pnpm, or yarn?
- Should native wrapper evaluation prefer Capacitor?

## Future Improvements

- Supabase database and auth.
- Capacitor iOS wrapper.
- Error monitoring.
- Privacy-preserving analytics.

## Related Documents

- [Architecture](./Architecture.md)
- [Database](./Database.md)
- [Coding Standards](./CodingStandards.md)
- [Roadmap](./Roadmap.md)

