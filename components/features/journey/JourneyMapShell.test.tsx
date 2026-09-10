import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";

describe("JourneyMapShell", () => {
  beforeEach(() => localStorage.clear());
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
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    expect(screen.getByRole("button", { name: "7" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Bevestig worp" }));
    expect(screen.getByRole("heading", { name: "+1 Poedersuiker" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Totale score: 1 resources");
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory")!)).toEqual({
      Bier: 0,
      Salmiak: 0,
      Poedersuiker: 1,
      Eten: 0
    });
    fireEvent.click(screen.getByRole("button", { name: "Verder naar de quiz" }));
    expect(screen.getByRole("heading", { name: "Het Bierpaleis" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "A. Prik & Tik, uw drankenspecialist" }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
    fireEvent.click(screen.getByRole("button", { name: "Verder naar de kaart" }));
    expect(screen.getByRole("listitem", { name: "Poedersuiker: 1" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 7 ogen");
    expect(screen.getByRole("listitem", { name: "Bier: 0" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "DICE" }));
    expect(screen.getByRole("button", { name: "Bevestig worp" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Terug naar de kaart" }));
    expect(screen.getByRole("status")).toHaveTextContent("Laatste worp: 7 ogen");
  });
});
