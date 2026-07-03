"use client";

import { useEffect } from "react";

const EVENT_HORN_SRC = "/audio/event-horn.mp3";
const EVENT_HORN_VOLUME = 0.6;
const playedEventSoundKeys = new Set<string>();

type UseEventSoundOptions = {
  enabled?: boolean;
  volume?: number;
  src?: string;
};

export function useEventSound(eventId: string | null, options: UseEventSoundOptions = {}) {
  const { enabled = true, volume = EVENT_HORN_VOLUME, src = EVENT_HORN_SRC } = options;

  useEffect(() => {
    if (!enabled || !eventId || playedEventSoundKeys.has(eventId)) {
      return;
    }

    void playEventSoundOnce(eventId, { enabled, volume, src });
  }, [enabled, eventId, src, volume]);
}

function clampVolume(volume: number) {
  if (Number.isNaN(volume)) {
    return EVENT_HORN_VOLUME;
  }

  return Math.min(Math.max(volume, 0), 1);
}

export function playEventSoundOnce(eventId: string | null, options: UseEventSoundOptions = {}) {
  const { enabled = true, volume = EVENT_HORN_VOLUME, src = EVENT_HORN_SRC } = options;

  if (!enabled || !eventId || playedEventSoundKeys.has(eventId)) {
    return Promise.resolve(false);
  }

  playedEventSoundKeys.add(eventId);

  const audio = new Audio(src);
  audio.volume = clampVolume(volume);
  audio.loop = false;

  return audio.play().then(
    () => true,
    (error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Event horn playback was blocked or failed.", error);
      }

      return false;
    }
  );
}
