# Lib

Application logic will live here once implementation begins.

Planned structure:

- `domain`: game models, commands, rules, validation, event generation.
- `state`: Zustand stores and selectors.
- `storage`: IndexedDB repositories and migrations.
- `api`: app-facing service boundary.
- `hooks`: shared React hooks when they are not feature-specific.

See [Architecture](../docs/Architecture.md) and [State Management](../docs/StateManagement.md).

