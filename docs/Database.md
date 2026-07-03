# Database

## Purpose

Define how data should be stored locally for the MVP and how the model can evolve toward Supabase later.

## Goals

- Persist active games locally.
- Support versioned data migrations.
- Keep storage implementation behind a repository boundary.
- Avoid cloud dependencies for MVP.

## MVP Storage Recommendation

Use IndexedDB through a storage adapter, likely Dexie during implementation.

Why: game records contain nested state, history, and future migration needs. IndexedDB is better suited than localStorage for this shape and is available in modern mobile browsers.

## Suggested Data Entities

- Game.
- Player.
- Resource definition.
- Player resource balance.
- Status effect.
- Event definition.
- Game history entry.
- Ruleset.
- App settings.

## Persistence Strategy

Store snapshots for fast resume and history entries for auditability. Keep migrations explicit and versioned.

Why: rebuilding from history alone is elegant but can slow development. Snapshots plus history give practical recovery while preserving explainability.

## Future Supabase Mapping

Supabase can later store:

- User-owned games if accounts are introduced.
- Anonymous backups using device-generated IDs if privacy allows.
- Ruleset libraries.
- Event packs.
- Shared playtest telemetry.

Domain models should remain independent from Supabase table types.

## Open Questions

- Should archived games be kept indefinitely?
- Should local data include schema version per record or global version only?
- Should export/import use JSON files?

## Future Improvements

- Encrypted local backups.
- Cloud sync.
- Conflict resolution for multiple devices.
- Playtest analytics.

## Related Documents

- [Architecture](./Architecture.md)
- [State Management](./StateManagement.md)
- [Tech Stack](./TechStack.md)
- [Decisions](./Decisions.md)

