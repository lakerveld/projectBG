import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";

describe("JourneyMapShell", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      }
    });
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
  it("shows the Antwerp illustration, three starting resources and the dice button", () => {
    render(<JourneyMapShell />);

    expect(screen.getByRole("heading", { name: "Kaart van Antwerpen" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Geïllustreerde kaart van Antwerpen/ })).toHaveAttribute(
      "src",
      expect.stringContaining("antwerp-six-locations.png")
    );
    for (const resource of ["Gerst", "Salmari", "Sneeuw"]) {
      expect(screen.getByRole("listitem", { name: `${resource}: 0` })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("button", { name: /— Op slot$/ })).toHaveLength(6);
    expect(screen.queryByRole("button", { name: /^7\. / })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DICE" })).toBeInTheDocument();
  });
  it("trades both rewards, persists the stock and prevents overspending", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 15, Salmari: 2, Sneeuw: 1 })
    );
    const view = render(<JourneyMapShell />);
    fireEvent.click(screen.getByText("Wat zijn je resources waard?"));
    fireEvent.click(screen.getByRole("button", { name: "Ruil 10 gerst voor 1 nakkie" }));
    expect(screen.getByRole("listitem", { name: "Sneeuw: 3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ruil 10 gerst voor 1 nakkie" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Ruil 5 gerst voor 1 Salmari" }));
    expect(screen.getByRole("button", { name: "Ruil 5 gerst voor 1 Salmari" })).toBeDisabled();
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Gerst: 0,
      Salmari: 3,
      Sneeuw: 3
    });
    view.unmount();
    render(<JourneyMapShell />);
    expect(screen.getByRole("listitem", { name: "Gerst: 0" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Salmari: 3" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Sneeuw: 3" })).toBeInTheDocument();
  });
  it("keeps the stock unchanged when a trade cannot be saved", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 5, Salmari: 0, Sneeuw: 0 })
    );
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByText("Wat zijn je resources waard?"));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Ruil 5 gerst voor 1 Salmari" }));
    expect(screen.getByRole("listitem", { name: "Gerst: 5" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "Salmari: 0" })).toBeInTheDocument();
    expect(screen.getByText(/Ruilen is niet gelukt/)).toBeInTheDocument();
  });
  it("uses resources, saves the deductions and disables unaffordable actions", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 4, Salmari: 1, Sneeuw: 3 })
    );
    const view = render(<JourneyMapShell />);
    fireEvent.click(screen.getByText("Wat zijn je resources waard?"));
    for (const name of [
      "Gebruik 3 gerst voor 1 biertje",
      "Gebruik 1 salmari voor 1 shotje",
      "Gebruik 2 sneeuw voor 1 nakkie"
    ]) {
      fireEvent.click(screen.getByRole("button", { name }));
      expect(screen.getByRole("button", { name })).toBeDisabled();
    }
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Gerst: 1,
      Salmari: 0,
      Sneeuw: 1
    });
    view.unmount();
    render(<JourneyMapShell />);
    for (const name of ["Gerst: 1", "Salmari: 0", "Sneeuw: 1"]) {
      expect(screen.getByRole("listitem", { name })).toBeInTheDocument();
    }
  });
  it("does not deduct consumed resources if saving fails", () => {
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 3, Salmari: 0, Sneeuw: 0 })
    );
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByText("Wat zijn je resources waard?"));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Gebruik 3 gerst voor 1 biertje" }));
    expect(screen.getByRole("listitem", { name: "Gerst: 3" })).toBeInTheDocument();
    expect(screen.getByText(/Gebruiken is niet gelukt/)).toBeInTheDocument();
  });
  it("rolls two digital dice and only awards resources after confirmation", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.999);
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    fireEvent.click(screen.getByRole("button", { name: "Digitaal dobbelen" }));
    expect(screen.getByRole("button", { name: "Dobbelstenen rollen…" })).toBeDisabled();
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.getByRole("status")).toHaveTextContent("Je gooide 1 + 6 = 7 ogen.");
    expect(screen.getByRole("button", { name: "7" })).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("rattan-journey-inventory")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Bevestig deze worp" }));
    expect(screen.getByRole("heading", { name: "De struikrover!" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.queryByText(/Je gooide/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
  });
  it("lets Matthew enter and confirm a roll, then starts a fresh entry", () => {
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.getByRole("heading", { name: /Matthew/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "10" }));
    expect(screen.getByRole("button", { name: "10" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("heading", { name: "+1 Sneeuw" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Je krijgt 1 Sneeuw.");
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Gerst: 0,
      Salmari: 0,
      Sneeuw: 1
    });
    fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
    expect(screen.getByRole("listitem", { name: "Sneeuw: 1" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 10 ogen");
    expect(screen.getByRole("listitem", { name: "Gerst: 0" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Terug naar de kaart" }));
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 10 ogen");
  });
  it("spins on seven, steals one owned resource exactly once, and returns to the map", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    localStorage.setItem(
      "rattan-journey-inventory",
      JSON.stringify({ Gerst: 2, Salmari: 0, Sneeuw: 1 })
    );
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("heading", { name: "De struikrover!" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("De automaat draait");
    expect(screen.getByRole("button", { name: "Naar de map" })).toBeDisabled();
    act(() => vi.advanceTimersByTime(3600));
    expect(screen.getByRole("status")).toHaveTextContent("−1 Sneeuw");
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Gerst: 2,
      Salmari: 0,
      Sneeuw: 0
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!).Sneeuw).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
    expect(screen.getByRole("heading", { name: "Kaart van Antwerpen" })).toBeInTheDocument();
  });
  it("does not award or deduct a resource when seven is rolled with empty stock", () => {
    render(<JourneyMapShell />);
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("status")).toHaveTextContent("Niets te halen!");
    expect(screen.getByRole("button", { name: "Naar de map" })).toBeEnabled();
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Gerst: 0,
      Salmari: 0,
      Sneeuw: 0
    });
  });
});
