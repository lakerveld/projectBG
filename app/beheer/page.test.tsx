import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import BeheerPage from "./page";

afterEach(() => vi.unstubAllGlobals());

it("edits and saves a quiz from any of the six locations", async () => {
  const locations = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1), name: `Locatie ${index + 1}`, status: "locked", ready: false,
    content: { name: `Locatie ${index + 1}`, question: "", answers: ["", "", "", ""], correct: -1, bonus: "" }
  }));
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ locations })));
  vi.stubGlobal("fetch", fetchMock);
  render(<BeheerPage />);
  const buttons = await screen.findAllByRole("button", { name: "Quiz bewerken" });
  expect(buttons).toHaveLength(6);
  fireEvent.click(buttons[5]);
  fireEvent.change(screen.getByLabelText("Vraag"), { target: { value: "Nieuwe vraag?" } });
  fireEvent.change(screen.getByLabelText("Antwoord A"), { target: { value: "Ja" } });
  fireEvent.click(screen.getByRole("button", { name: "Quiz opslaan" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/journey/admin", expect.objectContaining({
    method: "POST", body: expect.stringContaining('"id":"6","action":"save"')
  })));
  expect(await screen.findByRole("status")).toHaveTextContent("Quiz opgeslagen");
});
