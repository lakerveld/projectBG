import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";
import { publicLocation, transition, type StoredLocation } from "@/lib/domain/locationGame";

let locations: StoredLocation[];
beforeEach(() => {
  localStorage.clear();
  locations = Array.from({ length: 8 }, (_, index) => ({
    id: String(index + 1),
    status: "locked",
    quiz: {
      name: index === 0 ? "Het Bierpaleis" : `Locatie ${index + 1}`,
      question: "Welke spreuk is echt?",
      answers: ["Prik & Tik", "B", "C", "D"],
      correct: 0,
      bonus: "Ruil 1 bier voor 1 poedersuiker"
    }
  }));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === "POST") {
        const { id, action, answer } = JSON.parse(init.body as string);
        transition(
          locations.find((item) => item.id === id)!,
          action,
          answer
        );
      }
      return { ok: true, json: async () => ({ locations: locations.map(publicLocation) }) };
    })
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("keeps locked hexagons closed, notices an unlock and completes the location quiz", async () => {
  const vibrate = vi.fn();
  Object.defineProperty(navigator, "vibrate", { configurable: true, value: vibrate });
  render(<JourneyMapShell />);
  const first = await screen.findByRole("button", { name: /1. Het Bierpaleis — Op slot/ });
  fireEvent.click(first);
  expect(screen.getByRole("dialog")).toHaveTextContent("nog op slot");
  expect(screen.queryByRole("button", { name: "Activeren" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Terug" }));
  transition(locations[0], "unlock");
  act(() => window.dispatchEvent(new Event("online")));
  await screen.findByText("Nieuwe locatie ontgrendeld: Het Bierpaleis!");
  expect(vibrate).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /1. Het Bierpaleis — Beschikbaar/ }));
  fireEvent.click(screen.getByRole("button", { name: "Activeren" }));
  await screen.findByRole("group", { name: "Welke spreuk is echt?" });
  expect(screen.getByRole("button", { name: "Bevestig antwoord" })).toBeDisabled();
  fireEvent.click(screen.getByRole("radio", { name: "A. Prik & Tik" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await screen.findByText("Goed geantwoord!");
  fireEvent.click(screen.getByRole("button", { name: "Verder naar de kaart" }));
  expect(screen.getByRole("link", { name: "Ontwikkelingskaarten: 1" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /1. Het Bierpaleis — Afgerond/ }));
  fireEvent.click(screen.getByRole("button", { name: "Bekijk resultaat" }));
  await screen.findByText("Goed geantwoord!");
  expect(screen.queryByRole("button", { name: "Bevestig antwoord" })).not.toBeInTheDocument();
});

it("resumes a started quiz after reloading and keeps the quiz open when saving fails", async () => {
  locations[0].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(
    await screen.findByRole("button", { name: /1. Het Bierpaleis — Quiz hervatten/ })
  );
  fireEvent.click(screen.getByRole("button", { name: "Quiz hervatten" }));
  await screen.findByRole("radio", { name: "A. Prik & Tik" });
  vi.mocked(fetch).mockRejectedValueOnce(new Error("Geen verbinding"));
  fireEvent.click(screen.getByRole("radio", { name: "A. Prik & Tik" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Geen verbinding"));
  expect(locations[0].status).toBe("started");
  expect(screen.getByRole("button", { name: "Bevestig antwoord" })).toBeEnabled();
});
