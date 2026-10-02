import { beforeEach, expect, it, vi } from "vitest";
import { parseRewardEffect, rewardKey } from "./locationRewards";
import { readInventory } from "./journeyRewards";
import { applyAutomaticRewards, applyReward, writeInventory } from "@/lib/ui/useRewardInventory";
import type { LocationView } from "./locationGame";

beforeEach(() => localStorage.clear());

it.each([
  [
    "Ruil 2 gerst voor 2 sneeuw",
    { Gerst: 2, Salmari: 0, Sneeuw: 0 },
    { Gerst: 0, Salmari: 0, Sneeuw: 2 }
  ],
  [
    "Ruil 3 gerst voor 1 salmari",
    { Gerst: 3, Salmari: 0, Sneeuw: 0 },
    { Gerst: 0, Salmari: 1, Sneeuw: 0 }
  ],
  [
    "2 gerst =  1 salmari + 1 sneeuw",
    { Gerst: 2, Salmari: 0, Sneeuw: 0 },
    { Gerst: 0, Salmari: 1, Sneeuw: 1 }
  ],
  [
    "Ruil 1 salmari voor +2 gerst en +2 sneeuw",
    { Gerst: 0, Salmari: 1, Sneeuw: 0 },
    { Gerst: 2, Salmari: 0, Sneeuw: 2 }
  ],
  [
    "+3 Gerst, +3 Salmari ,+ 3 Sneeuw",
    { Gerst: 0, Salmari: 0, Sneeuw: 0 },
    { Gerst: 3, Salmari: 3, Sneeuw: 3 }
  ],
  ["+30 Sneeuw", { Gerst: 0, Salmari: 0, Sneeuw: 0 }, { Gerst: 0, Salmari: 0, Sneeuw: 30 }]
])("understands the configured reward %s", (bonus, cost, gain) => {
  expect(parseRewardEffect(bonus)).toEqual({ cost, gain });
});

it.each([
  "",
  "Ruil -1 gerst voor 2 sneeuw",
  "+2 gerst bij een goed antwoord, anders betaal je",
  "Ruil 1 onbekend voor 2 sneeuw",
  "0 gerst = 1 sneeuw"
])("does not guess unsupported effects: %s", (bonus) => {
  expect(parseRewardEffect(bonus)).toBeNull();
});

it("executes an exchange once and preserves consumption when the inventory changes later", () => {
  writeInventory({ Gerst: 4, Salmari: 0, Sneeuw: 1 });
  const effect = parseRewardEffect("2 gerst = 1 salmari + 1 sneeuw")!;
  applyReward("cheese", effect);
  expect(readInventory()).toEqual({ Gerst: 2, Salmari: 1, Sneeuw: 2 });
  writeInventory({ Gerst: 1, Salmari: 1, Sneeuw: 2 });
  applyReward("cheese", effect);
  expect(readInventory()).toEqual({ Gerst: 1, Salmari: 1, Sneeuw: 2 });
});

it("does not change inventory or use a card when resources are insufficient", () => {
  writeInventory({ Gerst: 1, Salmari: 0, Sneeuw: 0 });
  const original = localStorage.getItem("rattan-journey-inventory");
  expect(() => applyReward("cheese", parseRewardEffect("2 gerst = 1 sneeuw")!)).toThrow(
    "Niet genoeg"
  );
  expect(localStorage.getItem("rattan-journey-inventory")).toBe(original);
  writeInventory({ Gerst: 2, Salmari: 0, Sneeuw: 0 });
  applyReward("cheese", parseRewardEffect("2 gerst = 1 sneeuw")!);
  expect(readInventory()).toEqual({ Gerst: 0, Salmari: 0, Sneeuw: 1 });
});

it("automatically applies a confirmed purchase reward once across repeated reads", () => {
  const location: LocationView = {
    id: "5",
    name: "Skins",
    status: "completed",
    ready: true,
    result: {
      correct: true,
      correctAnswer: "",
      bonus: "+3 Gerst, +3 Salmari ,+ 3 Sneeuw",
      rewardId: "first"
    }
  };
  applyAutomaticRewards({ locations: [location] });
  applyAutomaticRewards({ locations: [location] });
  expect(readInventory()).toEqual({ Gerst: 3, Salmari: 3, Sneeuw: 3 });
  location.result!.rewardId = "second";
  applyAutomaticRewards({ locations: [location] });
  expect(readInventory()).toEqual({ Gerst: 6, Salmari: 6, Sneeuw: 6 });
  expect(rewardKey(location)).toContain("second");
});

it("never automatically charges an exchange or rewards an incorrect answer", () => {
  applyAutomaticRewards({
    locations: [
      {
        id: "3",
        name: "Cheese",
        ready: true,
        status: "completed",
        result: { correct: true, correctAnswer: "", bonus: "2 gerst = 1 sneeuw" }
      },
      {
        id: "1",
        name: "Quiz",
        ready: true,
        status: "completed",
        result: { correct: false, correctAnswer: "A", bonus: "+3 gerst" }
      }
    ]
  });
  expect(localStorage.getItem("rattan-journey-inventory")).toBeNull();
});

it("keeps a reward claimable if storage fails", () => {
  const effect = parseRewardEffect("+3 gerst")!;
  const setter = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("full");
  });
  expect(() => applyReward("skins", effect)).toThrow("full");
  setter.mockRestore();
  applyReward("skins", effect);
  expect(readInventory().Gerst).toBe(3);
});
