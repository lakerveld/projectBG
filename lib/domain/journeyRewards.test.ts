import { describe, expect, it } from "vitest";
import {
  resourceForRoll,
  readInventory,
  emptyInventory,
  stealRandomResource
} from "./journeyRewards";

describe("journey rewards", () => {
  it.each([
    [2, "Bier"],
    [4, "Bier"],
    [5, "Salmiak"],
    [6, "Salmiak"],
    [7, null],
    [9, "Poedersuiker"],
    [10, "Eten"],
    [12, "Eten"]
  ])("maps %s to %s", (roll, resource) => {
    expect(resourceForRoll(Number(roll))).toBe(resource);
  });
  it.each([1, 13, 2.5, NaN])("rejects invalid total %s", (roll) =>
    expect(() => resourceForRoll(roll)).toThrow()
  );
  it("recovers from malformed storage", () => {
    localStorage.setItem("rattan-journey-inventory", "invalid");
    expect(readInventory()).toEqual(emptyInventory);
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Bier: -1, Salmiak: "4", Eten: 2 })
    );
    expect(readInventory()).toEqual({ ...emptyInventory, Eten: 2 });
    localStorage.clear();
  });
});

describe("robber theft", () => {
  it.each([0, 0.24, 0.5, 0.99])("only steals an owned resource for random value %s", (random) => {
    const inventory = { ...emptyInventory, Salmiak: 2 };
    const result = stealRandomResource(inventory, () => random);
    expect(result).toEqual({ resource: "Salmiak", inventory: { ...emptyInventory, Salmiak: 1 } });
    expect(inventory.Salmiak).toBe(2);
  });
  it("selects among available types", () => {
    const inventory = { ...emptyInventory, Bier: 3, Eten: 1 };
    expect(stealRandomResource(inventory, () => 0).resource).toBe("Bier");
    expect(stealRandomResource(inventory, () => 0.99).resource).toBe("Eten");
  });
  it("leaves empty inventory unchanged", () => {
    expect(stealRandomResource(emptyInventory)).toEqual({
      resource: null,
      inventory: emptyInventory
    });
  });
});
