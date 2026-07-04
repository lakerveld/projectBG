# Mechanics

## Purpose

Document the initial mechanical systems the MVP should support and the boundaries between app-managed companion mechanics and physical-board decisions.

## Goals

- Keep mechanics modular and testable.
- Make each mechanic understandable during live play.
- Avoid hidden rules that only the app knows.
- Support fast manual correction.

## MVP Mechanics

### Game Creation

Players create a local session with a name, a player list of up to four people, and basic ruleset options.

The current setup palette is fixed to four curated player colors: white, orange, blue, and red.

### Resource Tracking

Each player has a resource inventory. Resource changes can come from manual edits, events, trades, attacks, defenses, bonuses, or penalties.

### Dice Entry

Players enter dice results. Dice results can trigger events and history entries.

### Events

Events are generated from dice outcomes and ruleset tables. Events should have typed effects so they can be tested and replayed. 

Example: 
- Harvest Boom: Players with the most wheat get bonus gold in the app. 


### Bonuses

Bonuses are positive temporary or immediate effects. Examples: gain one resource, prevent a penalty, improve defense, or reduce trade cost. 


### Penalties

Penalties are negative temporary or immediate effects. Examples: lose one resource, skip a bonus, become vulnerable to attack, or pay extra for a trade.

### Trade Support

The app should support selected players, offered resources, requested resources, accepted/declined status, and final settlement.

### Attack/Defense

Conflict actions should be simple in the MVP:

- Attacker selects target.
- App validates cost or cooldown.
- Defender may use a defense option if available.
- Result changes resources/status and records history.

## Open Questions

- Should resource edits require confirmation?
- Should events be purely random or weighted by player position?
- Should conflict be opt-in per game?

## Future Improvements

- Advanced card-like effects.
- Player-specific abilities.
- Scenario modifiers.
- Balance telemetry.

## Related Documents

- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Events](./Events.md)
- [Kingdom](./Kingdom.md)
- [State Management](./StateManagement.md)
