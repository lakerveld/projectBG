import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";

describe("JourneyMapShell", () => {
  it("renders the Antwerp map shell with current and next locations", () => {
    render(<JourneyMapShell />);

    expect(screen.getByRole("heading", { name: "Antwerp Journey" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Het Steen" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Groenplaats" })).toBeInTheDocument();
    expect(screen.getByText("GPS searching")).toBeInTheDocument();
    expect(screen.getByText("0 of 4 stops complete")).toBeInTheDocument();
  });
});
