# Vision

## Purpose

Define the long-term product direction for a mobile-first board game companion app that enhances physical tabletop play without replacing the board, pieces, negotiation, or social experience.

## Product Vision

ProjectBG is a shared-table game master that runs on one phone placed near the board. It helps players track state, trigger surprises, resolve lightweight conflict mechanics, and preserve game history while keeping attention on the physical game.

The first product target is a Catan-inspired MVP because it has clear resources, turns, dice, trades, bonuses, penalties, and player development arcs. The design should remain generic enough to support additional board-game-inspired rule packs later.

It should give the users a new dimension to the game. Like a DLC or update. 

## Goals

- Make one shared phone useful at the table without requiring accounts, setup friction, or multiple devices.
- Reduce bookkeeping for resources, events, bonuses, penalties, attacks, defenses, and history.
- Add optional companion mechanics that create tension and variety without invalidating the physical board game.
- Keep game data local for the MVP.
- Establish a professional architecture that can later support Supabase, sync, native app wrappers, and App Store distribution.

## Non-Goals

- Replacing the physical board game.
- Implementing online multiplayer in the MVP.
- Requiring player login, cloud saves, or profiles.
- Simulating a complete Catan rules engine.
- Using copyrighted names, artwork, or protected rule text from commercial games.

## Product Principles

- Physical-first: the app should support table play, not pull focus away from it.
- Shared-screen clarity: every screen must be legible and usable from a table angle.
- Fast correction: mistakes happen in tabletop games; undo/history must be easy.
- Local trust: MVP game state stays on the device.
- Rules modularity: companion mechanics should be configurable over time.

## Open Questions

- How close can the companion mechanics be to Catan-inspired play while remaining legally distinct?
	- Using materials like grain, wood, stone.
	- But also adding new items like gold, water, soldiers. 
- Should the MVP include only one ruleset or a small configurable ruleset editor?
	- I want to start with one ruleset, later we can configure it
- How much hidden information is acceptable on a shared phone?
	- Depends on what is hidden. Not sure what you're asking here.
- Should trading be purely logged, suggested, or partially automated?
	- That is something for later. 

## Future Improvements

- Rule packs for multiple physical board games.
- Optional cloud backup and cross-device continuation.
- Native iOS wrapper with offline-first storage.
- Player profiles and long-term campaign progression.
- AI-assisted event generation and balance tuning.

## Related Documents

- [MVP](./MVP.md)
- [Roadmap](./Roadmap.md)
- [Game Design](./GameDesign.md)
- [Architecture](./Architecture.md)
- [UX](./UX.md)

