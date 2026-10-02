"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  emptyInventory,
  readInventory,
  rewardResources,
  type JourneyInventory
} from "@/lib/domain/journeyRewards";
import {
  isExchange,
  parseRewardEffect,
  rewardKey,
  type RewardEffect
} from "@/lib/domain/locationRewards";
import type { JourneyView } from "@/lib/domain/locationGame";

const KEY = "rattan-journey-inventory";
const EVENT = "rattan-inventory-changed";

function snapshot() {
  return localStorage.getItem(KEY);
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(EVENT, notify);
  };
}
function usedRewards(raw = snapshot()): string[] {
  try {
    const value = JSON.parse(raw ?? "null")?._usedRewards;
    return Array.isArray(value)
      ? value.filter((key): key is string => typeof key === "string")
      : [];
  } catch {
    return [];
  }
}
function save(inventory: JourneyInventory, used: string[]) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ ...inventory, ...(used.length ? { _usedRewards: used } : {}) })
  );
  window.dispatchEvent(new Event(EVENT));
}
export function writeInventory(inventory: JourneyInventory) {
  save(inventory, usedRewards());
}
export function resetInventory() {
  save({ ...emptyInventory }, []);
}
export function applyReward(key: string, effect: RewardEffect) {
  const used = usedRewards();
  if (used.includes(key)) return;
  const inventory = readInventory();
  const next = { ...inventory };
  for (const resource of rewardResources) {
    if (inventory[resource] < effect.cost[resource])
      throw new Error(`Niet genoeg ${resource}: je hebt ${effect.cost[resource]} nodig.`);
    next[resource] += effect.gain[resource] - effect.cost[resource];
    if (!Number.isSafeInteger(next[resource]))
      throw new Error("Deze beloning past niet in je voorraad.");
  }
  // Resource changes and the used marker are persisted together.
  save(next, [...used, key]);
}
export function applyAutomaticRewards(journey: JourneyView) {
  for (const location of journey.locations) {
    if (!location.result?.correct || !location.result.bonus) continue;
    const effect = parseRewardEffect(location.result.bonus);
    if (effect && !isExchange(effect)) applyReward(rewardKey(location), effect);
  }
}
export function useRewardInventory() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(
    () => ({
      inventory: raw === null ? { ...emptyInventory } : readInventory(),
      used: usedRewards(raw)
    }),
    [raw]
  );
}
