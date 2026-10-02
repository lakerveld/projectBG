import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DevelopmentCardsPage from "./page";
import { awardDevelopmentCard, DEVELOPMENT_CARDS_KEY } from "@/lib/ui/useDevelopmentCards";
import { parseEarnedCards } from "@/lib/domain/developmentCards";

describe("development card collection", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows an empty collection and a route back to the map", () => {
    render(<DevelopmentCardsPage />);
    expect(screen.getByRole("heading", { name: "Je hebt nog geen kaarten" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terug naar de kaart" })).toHaveAttribute(
      "href",
      "/journey"
    );
  });

  it("restores a saved card and shows its bonus", () => {
    localStorage.setItem(DEVELOPMENT_CARDS_KEY, JSON.stringify(["bierpaleis"]));
    render(<DevelopmentCardsPage />);
    expect(screen.getByRole("heading", { name: "Ruil 1 pils voor 1 sneeuw" })).toBeInTheDocument();
    expect(screen.getByText("Het Bierpaleis")).toBeInTheDocument();
  });

  it("updates the collection immediately and never duplicates an earned card", () => {
    render(<DevelopmentCardsPage />);
    act(() => {
      awardDevelopmentCard("bierpaleis");
      awardDevelopmentCard("bierpaleis");
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(DEVELOPMENT_CARDS_KEY)!)).toEqual(["bierpaleis"]);
  });

  it("ignores damaged storage and unknown cards", () => {
    expect(parseEarnedCards("broken")).toEqual([]);
    expect(parseEarnedCards('{"bierpaleis":true}')).toEqual([]);
    expect(parseEarnedCards('["unknown", "bierpaleis", "bierpaleis"]')).toEqual(["bierpaleis"]);
    expect(awardDevelopmentCard("unknown")).toBe(false);
    expect(localStorage.getItem(DEVELOPMENT_CARDS_KEY)).toBeNull();
  });
});

it("executes an earned trade, updates the stock and prevents a second use", () => {
  localStorage.setItem(DEVELOPMENT_CARDS_KEY, JSON.stringify(["bierpaleis"]));
  localStorage.setItem(
    "rattan-journey-inventory",
    JSON.stringify({ Gerst: 1, Salmari: 0, Sneeuw: 0 })
  );
  render(<DevelopmentCardsPage />);
  fireEvent.click(screen.getByRole("button", { name: "Voer ruil uit" }));
  expect(screen.getByText("Ruil uitgevoerd · kaart gebruikt")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Voer ruil uit" })).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toMatchObject({
    Gerst: 0,
    Salmari: 0,
    Sneeuw: 1
  });
});
