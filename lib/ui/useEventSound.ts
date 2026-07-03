"use client";

import { useEffect } from "react";

const EVENT_HORN_SRC = "/audio/event-horn.mp3";
const EVENT_HORN_VOLUME = 0.6;
const playedEventSoundKeys = new Set<string>();
let eventAudio: HTMLAudioElement | null = null;
let eventAudioSrc = "";

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

function getEventAudio(src: string) {
  if (!eventAudio || eventAudioSrc !== src) {
    eventAudio = new Audio(src);
    eventAudio.preload = "auto";
    eventAudio.loop = false;
    eventAudioSrc = src;
  }

  return eventAudio;
}

export function unlockEventSound(options: UseEventSoundOptions = {}) {
  const { enabled = true, volume = EVENT_HORN_VOLUME, src = EVENT_HORN_SRC } = options;

  if (!enabled) {
    return Promise.resolve(false);
  }

  const audio = getEventAudio(src);
  audio.muted = true;
  audio.volume = 0;
  audio.currentTime = 0;

  return audio.play().then(
    () => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      audio.volume = clampVolume(volume);

      return true;
    },
    (error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Event horn unlock was blocked or failed.", error);
      }

      return false;
    }
  );
}

export function playEventSoundOnce(eventId: string | null, options: UseEventSoundOptions = {}) {
  const { enabled = true, volume = EVENT_HORN_VOLUME, src = EVENT_HORN_SRC } = options;

  if (!enabled || !eventId || playedEventSoundKeys.has(eventId)) {
    return Promise.resolve(false);
  }

  const audio = getEventAudio(src);
  audio.pause();
  audio.currentTime = 0;
  audio.muted = false;
  audio.volume = clampVolume(volume);
  audio.loop = false;

  return audio.play().then(
    () => {
      playedEventSoundKeys.add(eventId);

      return true;
    },
    (error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Event horn playback was blocked or failed.", error);
      }

      return false;
    }
  );
}
