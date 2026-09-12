import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";

describe("JourneyMapShell", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("shows the Antwerp illustration, four starting resources and the dice button", () => {
    render(<JourneyMapShell />);

    expect(screen.getByRole("heading", { name: "Kaart van Antwerpen" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Geïllustreerde kaart van Antwerpen/ })).toHaveAttribute(
      "src",
      expect.stringContaining("antwerp-journey.png")
    );
    for (const resource of ["Bier", "Salmiak", "Poedersuiker", "Eten"]) {
      expect(screen.getByRole("listitem", { name: `${resource}: 0` })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "DICE" })).toBeInTheDocument();
  });
  it("lets Matthew enter and confirm a roll, then starts a fresh entry", () => {
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.getByRole("heading", { name: /Matthew/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "8" }));
    expect(screen.getByRole("button", { name: "8" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("heading", { name: "+1 Poedersuiker" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Totale score: 1 resources");
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Bier: 0,
      Salmiak: 0,
      Poedersuiker: 1,
      Eten: 0
    });
    fireEvent.click(screen.getByRole("button", { name: "Verder naar de kaart" }));
    expect(screen.getByRole("listitem", { name: "Poedersuiker: 1" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 8 ogen");
    expect(screen.getByRole("listitem", { name: "Bier: 0" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Terug naar de kaart" }));
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 8 ogen");
  });
  it("spins on seven, steals one owned resource exactly once, and returns to the map", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Bier: 2, Salmiak: 0, Poedersuiker: 0, Eten: 1 })
    );
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("heading", { name: "De struikrover!" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("De automaat draait");
    expect(screen.getByRole("button", { name: "Verder naar de kaart" })).toBeDisabled();
    act(() => vi.advanceTimersByTime(3600));
    expect(screen.getByRole("status")).toHaveTextContent("−1 Eten");
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Bier: 2,
      Salmiak: 0,
      Poedersuiker: 0,
      Eten: 0
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!).Eten).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Verder naar de kaart" }));
    expect(screen.getByRole("heading", { name: "Kaart van Antwerpen" })).toBeInTheDocument();
  });
  it("does not award or deduct a resource when seven is rolled with empty stock", () => {
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("status")).toHaveTextContent("Niets te halen!");
    expect(screen.getByRole("button", { name: "Verder naar de kaart" })).toBeEnabled();
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Bier: 0,
      Salmiak: 0,
      Poedersuiker: 0,
      Eten: 0
    });
  });
});
