# Resource Ledger

## Problem

Matthew needs a simple way to see how his resources change after a location is resolved.

## Scope

- Show current resource totals.
- Update the ledger after a valid reward.
- Prevent negative totals unless a later rule allows it.
- Persist the updated ledger locally.

## User Flow

1. A location resolves.
2. The app shows the resource change.
3. Matthew sees the updated totals.
4. The result is saved locally.

## Domain Behavior

- Resource IDs should be stable.
- Resource quantities should be stored by resource ID.
- Every committed change should create a history entry.

## Data Shape

See [Feature 1 Plan](../docs/Feature1Plan.md) and [Resources](../docs/Resources.md).

## Acceptance Criteria

- The ledger shows current counts.
- The counts update after a reward.
- The updated state survives refresh.
- The history entry matches the change.

## Test Notes

- Unit tests should cover resource updates and invalid negatives.
- End-to-end tests should cover the full resolve-to-ledger path.

## Related Docs

- [Feature 1 Plan](../docs/Feature1Plan.md)
- [Resources](../docs/Resources.md)
- [State Management](../docs/StateManagement.md)
