# Backlog

## Purpose

Maintain the product backlog for the Antwerp journey. Complexity estimates use XS, S, M, L, and XL. Scope marks whether the item belongs to feature 1 or a future slice.

## Goals

- Give development a clear starting sequence.
- Keep feature 1 separate from future route content.
- Make complexity visible early.
- Support sprint planning without locking implementation details too soon.

## Backlog

| Type | Item | Description | Complexity | Scope |
| --- | --- | --- | --- | --- |
| Epic | Project Foundation | Repository, documentation, architecture, and standards. | M | Feature 1 |
| Task | Create project structure | Add docs, design, prompts, app, components, lib, public, and specs. | XS | Feature 1 |
| Task | Create documentation corpus | Add planning and architecture docs with cross-links. | M | Feature 1 |
| Task | Add README, license, gitignore | Establish basic repository identity and Git hygiene. | XS | Feature 1 |
| Epic | Map Shell | Build the first Antwerp route screen. | L | Feature 1 |
| Feature | Antwerp Map | Show the city as the journey board. | M | Feature 1 |
| Story | Show current journey state | As Matthew, I can see where I am and what comes next. | S | Feature 1 |
| Story | Show GPS status | As Matthew, I can tell whether the app knows my location. | XS | Feature 1 |
| Story | Show route progress | As Matthew, I can see completed and remaining stops. | S | Feature 1 |
| Epic | Location Activation | Detect or confirm arrival at a stop. | M | Feature 1 |
| Feature | Arrival Check | Mark a location as active when Matthew arrives. | M | Feature 1 |
| Story | Detect GPS arrival | As Matthew, the app activates a location when I reach it. | M | Feature 1 |
| Story | Confirm arrival manually | As an organizer, I can confirm a stop when GPS is uncertain. | S | Feature 1 |
| Feature | Active Location Sheet | Show the current stop clearly. | S | Feature 1 |
| Story | Show location details | As Matthew, I can see the current stop and its reward context. | S | Feature 1 |
| Epic | Dice Resolution | Enter physical dice totals and resolve the stop. | M | Feature 1 |
| Feature | Dice Entry | Manual dice total input. | S | Feature 1 |
| Story | Enter dice result | As Matthew, I can record my physical roll. | XS | Feature 1 |
| Story | Validate dice result | As Matthew, I get feedback for invalid totals. | XS | Feature 1 |
| Feature | Location Reward | Map dice results to a location-specific reward. | M | Feature 1 |
| Story | Resolve reward table | As Matthew, the active location gives a defined result based on the roll. | M | Feature 1 |
| Story | Update resources | As Matthew, the app adds the right resource to my ledger. | M | Feature 1 |
| Epic | Resource Ledger | Track Matthew's resources locally. | M | Feature 1 |
| Feature | Resource Tracking | Show current counts and updates. | M | Feature 1 |
| Story | View resource totals | As Matthew, I can see my current resources quickly. | S | Feature 1 |
| Story | Record resource change | As Matthew, every reward updates the ledger. | S | Feature 1 |
| Epic | Persistence | Save and restore the active journey. | M | Feature 1 |
| Feature | Local Storage | Persist the journey in IndexedDB. | M | Feature 1 |
| Story | Resume active journey | As Matthew, a refresh does not lose my progress. | M | Feature 1 |
| Epic | Journey History | Audit meaningful route changes. | S | Feature 1 |
| Feature | History List | Chronological list of route events. | S | Feature 1 |
| Story | View journey history | As Matthew, I can see how my journey changed. | S | Feature 1 |
| Epic | Future Route Content | Story beats, intermission tasks, and organizer tools. | XL | Future |
| Feature | Story Beats | Add optional prompts between locations. | M | Future |
| Feature | Organizer Tools | Allow manual pacing and overrides. | M | Future |
| Feature | Route Packs | Support more Antwerp routes later. | L | Future |
| Feature | Cloud Backup | Optional sync and export. | XL | Future |

## Open Questions

- Should the first slice use one fixed route or a small editable route list?
- Should location rewards be stored in content files or in code?
- Should the organizer confirm every stop or only GPS edge cases?

## Future Improvements

- Convert backlog into GitHub issues.
- Add priority and dependency fields.
- Add acceptance criteria per story.
- Add release milestone mapping.

## Related Documents

- [Roadmap](./Roadmap.md)
- [MVP](./MVP.md)
- [Sprint 0](./Sprint0.md)
- [Sprint 1](./Sprint1.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
- [Sprint 5](./Sprint5.md)
- [Feature 1 Plan](./Feature1Plan.md)
