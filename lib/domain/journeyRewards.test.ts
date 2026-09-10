import { describe, expect, it } from "vitest";
import { resourceForRoll, readInventory, emptyInventory } from "./journeyRewards";

describe("journey rewards", () => {
  it.each([
    [2, "Bier"],
    [4, "Bier"],
    [5, "Salmiak"],
    [6, "Salmiak"],
    [7, "Poedersuiker"],
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
