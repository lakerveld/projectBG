import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import BeheerPage from "./page";

afterEach(() => vi.unstubAllGlobals());

it("edits and saves a quiz from any of the six locations", async () => {
  const locations = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1),
    name: `Locatie ${index + 1}`,
    status: "locked",
    ready: false,
    content: {
      name: `Locatie ${index + 1}`,
      question: "",
      answers: ["", "", "", ""],
      correct: -1,
      bonus: ""
    }
  }));
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ locations })));
  vi.stubGlobal("fetch", fetchMock);
  render(<BeheerPage />);
  const buttons = await screen.findAllByRole("button", { name: "Quiz bewerken" });
  expect(buttons).toHaveLength(6);
  fireEvent.click(buttons[5]);
  fireEvent.change(screen.getByLabelText("Vraag / opdracht"), {
    target: { value: "Nieuwe vraag?" }
  });
  fireEvent.change(screen.getByLabelText("Antwoord A"), { target: { value: "Ja" } });
  fireEvent.click(screen.getByRole("button", { name: "Quiz opslaan" }));
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/journey/admin",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"id":"6","action":"save"')
      })
    )
  );
  expect(await screen.findByRole("status")).toHaveTextContent("Quiz opgeslagen");
});

it("allows releasing all six locations without completed quizzes", async () => {
  const locations = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1),
    name: `Locatie ${index + 1}`,
    status: "locked",
    ready: false,
    content: {
      name: `Locatie ${index + 1}`,
      question: "",
      answers: ["", "", "", ""],
      correct: -1,
      bonus: ""
    }
  }));
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ locations })));
  vi.stubGlobal("fetch", fetchMock);
  render(<BeheerPage />);
  const buttons = await screen.findAllByRole("switch");
  expect(buttons).toHaveLength(6);
  for (const button of buttons) expect(button).toBeEnabled();
  fireEvent.click(buttons[5]);
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/journey/admin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ id: "6", action: "unlock" })
      })
    )
  );
  expect(await screen.findByRole("status")).toHaveTextContent("Locatie 6 is vrijgegeven");
});

it("toggles a released location off and back on", async () => {
  const location = {
    id: "1", name: "Locatie 1", status: "available", ready: false,
    content: { name: "Locatie 1", question: "", answers: ["", "", "", ""], correct: -1, bonus: "" }
  };
  const fetchMock = vi.fn(async (_url: unknown, options?: RequestInit) => {
    if (options?.method === "POST") {
      const { action } = JSON.parse(options.body as string);
      location.status = action === "lock" ? "locked" : "available";
    }
    return new Response(JSON.stringify({ locations: [location] }));
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<BeheerPage />);
  const toggle = await screen.findByRole("switch", { name: "Locatie 1 vrijgeven" });
  expect(toggle).toBeChecked();
  fireEvent.click(toggle);
  await waitFor(() => expect(toggle).not.toBeChecked());
  expect(screen.getByRole("status")).toHaveTextContent("Locatie 1 staat weer op slot");
  fireEvent.click(toggle);
  await waitFor(() => expect(toggle).toBeChecked());
});
