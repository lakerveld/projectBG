"use client";

import { resetDevelopmentCards } from "./useDevelopmentCards";
import { resetInventory } from "./useRewardInventory";

const RESET_KEY = "rattan-journey-reset-id";

// Persist the acknowledgement last so interrupted resets are retried on refresh.
export function applyJourneyReset(resetId?: string): boolean {
  if (!resetId || localStorage.getItem(RESET_KEY) === resetId) return false;
  resetInventory();
  resetDevelopmentCards();
  localStorage.removeItem("rattan-location-notices");
  localStorage.setItem(RESET_KEY, resetId);
  return true;
}
