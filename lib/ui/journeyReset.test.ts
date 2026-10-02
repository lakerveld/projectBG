import { beforeEach, expect, it } from "vitest";
import { applyJourneyReset } from "./journeyReset";
import { readInventory } from "@/lib/domain/journeyRewards";
import { awardDevelopmentCard, DEVELOPMENT_CARDS_KEY } from "./useDevelopmentCards";
import { writeInventory } from "./useRewardInventory";

beforeEach(() => localStorage.clear());

it("clears local resources, reward usage, cards and notices even on the first visit after a remote reset", () => {
  localStorage.setItem(
    "rattan-journey-inventory",
    JSON.stringify({ Gerst: 8, Salmari: 3, Sneeuw: 2, _usedRewards: ["old"] })
  );
  awardDevelopmentCard("bierpaleis");
  localStorage.setItem("rattan-location-notices", '["1:123"]');
  expect(applyJourneyReset("reset-1")).toBe(true);
  expect(readInventory()).toEqual({ Gerst: 0, Salmari: 0, Sneeuw: 0 });
  expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).not.toHaveProperty(
    "_usedRewards"
  );
  expect(localStorage.getItem(DEVELOPMENT_CARDS_KEY)).toBeNull();
  expect(localStorage.getItem("rattan-location-notices")).toBeNull();
  writeInventory({ Gerst: 2, Salmari: 0, Sneeuw: 0 });
  expect(applyJourneyReset("reset-1")).toBe(false);
  expect(readInventory().Gerst).toBe(2);
  expect(applyJourneyReset("reset-2")).toBe(true);
  expect(readInventory().Gerst).toBe(0);
});

it("preserves existing inventory before the first reset", () => {
  writeInventory({ Gerst: 3, Salmari: 1, Sneeuw: 2 });
  expect(applyJourneyReset()).toBe(false);
  expect(readInventory().Gerst).toBe(3);
});
