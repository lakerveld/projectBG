import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DevelopmentQuiz } from "./DevelopmentQuiz";

describe("DevelopmentQuiz", () => {
  beforeEach(() => localStorage.clear());
  it("requires one of four answers and awards the placeholder card for A", () => {
    const onContinue = vi.fn();
    render(<DevelopmentQuiz onContinue={onContinue} />);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { name: "Ruil 1 bier voor 1 poedersuiker" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bevestig antwoord" })).toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /^A\./ }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
    expect(screen.getByRole("status")).toHaveTextContent("Goed geantwoord!");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Het gebruiken van deze bonus volgt later."
    );
    expect(JSON.parse(localStorage.getItem("rattan-development-cards")!)).toEqual(["bierpaleis"]);
    expect(screen.getByRole("link", { name: "Bekijk je ontwikkelingskaarten" })).toHaveAttribute(
      "href",
      "/development-cards"
    );
    for (const option of screen.getAllByRole("radio")) expect(option).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Verder naar de kaart" }));
    expect(onContinue).toHaveBeenCalledOnce();
  });
  it.each(["B", "C", "D"])("shows the correct answer after an incorrect %s", (letter) => {
    render(<DevelopmentQuiz onContinue={() => {}} />);
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(`^${letter}\\.`) }));
    fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
    expect(screen.getByRole("status")).toHaveTextContent("Het juiste antwoord is A");
    expect(localStorage.getItem("rattan-development-cards")).toBeNull();
    expect(screen.getByRole("status")).not.toHaveTextContent(
      "Je hebt de ontwikkelingskaart verdiend"
    );
  });
});
