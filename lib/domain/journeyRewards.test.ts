import { describe, expect, it } from "vitest";
import {
  resourceForRoll,
  readInventory,
  emptyInventory,
  stealRandomResource
} from "./journeyRewards";

describe("journey rewards", () => {
  it.each([
    [2, "Salmari"],
    [3, "Sneeuw"],
    [4, "Salmari"],
    [5, "Sneeuw"],
    [6, "Gerst"],
    [7, null],
    [8, "Gerst"],
    [9, "Gerst"],
    [10, "Sneeuw"],
    [11, "Sneeuw"],
    [12, "Salmari"]
  ])("maps %s to %s", (roll, resource) => {
    expect(resourceForRoll(Number(roll))).toBe(resource);
  });
  it.each([1, 13, 2.5, NaN])("rejects invalid total %s", (roll) =>
    expect(() => resourceForRoll(roll)).toThrow()
  );
  it("migrates legacy resources and drops food", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Bier: 3, Salmiak: 2, Poedersuiker: 4, Eten: 5 })
    );
    expect(readInventory()).toEqual({ Gerst: 3, Salmari: 2, Sneeuw: 4 });
    localStorage.clear();
  });
  it("preserves the previous three-resource inventory", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 3, Salmiak: 2, Sneeuwvlokje: 4 })
    );
    expect(readInventory()).toEqual({ Gerst: 3, Salmari: 2, Sneeuw: 4 });
    localStorage.clear();
  });
  it("migrates Pils and Salmiak without losing existing quantities", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Pils: 5, Salmiak: 3, Sneeuw: 2 })
    );
    expect(readInventory()).toEqual({ Gerst: 5, Salmari: 3, Sneeuw: 2 });
    localStorage.clear();
  });
  it("recovers from malformed storage", () => {
    localStorage.setItem("rattan-journey-inventory", "invalid");
    expect(readInventory()).toEqual(emptyInventory);
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: -1, Salmari: "4", Sneeuw: 2 })
    );
    expect(readInventory()).toEqual({ ...emptyInventory, Sneeuw: 2 });
    localStorage.clear();
  });
});

describe("robber theft", () => {
  it.each([0, 0.24, 0.5, 0.99])("only steals an owned resource for random value %s", (random) => {
    const inventory = { ...emptyInventory, Salmari: 2 };
    const result = stealRandomResource(inventory, () => random);
    expect(result).toEqual({ resource: "Salmari", inventory: { ...emptyInventory, Salmari: 1 } });
    expect(inventory.Salmari).toBe(2);
  });
  it("selects among available types", () => {
    const inventory = { ...emptyInventory, Gerst: 3, Sneeuw: 1 };
    expect(stealRandomResource(inventory, () => 0).resource).toBe("Gerst");
    expect(stealRandomResource(inventory, () => 0.99).resource).toBe("Sneeuw");
  });
  it("leaves empty inventory unchanged", () => {
    expect(stealRandomResource(emptyInventory)).toEqual({
      resource: null,
      inventory: emptyInventory
    });
  });
});
