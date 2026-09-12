"use client";

import { useSyncExternalStore } from "react";
import { developmentCards, parseEarnedCards } from "@/lib/domain/developmentCards";

export const DEVELOPMENT_CARDS_KEY = "rattan-development-cards";
const CHANGE_EVENT = "rattan-development-cards-changed";
let sessionFallback: string | null = null;

function getSnapshot() {
  if (sessionFallback !== null) return sessionFallback;
  try {
    return localStorage.getItem(DEVELOPMENT_CARDS_KEY);
  } catch {
    return null;
  }
}

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

export function awardDevelopmentCard(id: string): boolean {
  if (!developmentCards.some((card) => card.id === id)) return false;
  const earned = parseEarnedCards(getSnapshot());
  const next = JSON.stringify([...new Set([...earned, id])]);
  let saved = true;
  try {
    localStorage.setItem(DEVELOPMENT_CARDS_KEY, next);
    sessionFallback = null;
  } catch {
    sessionFallback = next;
    saved = false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return saved;
}

export function useDevelopmentCards() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const earned = parseEarnedCards(raw);
  return developmentCards.filter((card) => earned.includes(card.id));
}
