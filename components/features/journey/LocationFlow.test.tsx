import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { JourneyMapShell } from "./JourneyMapShell";
import { publicLocation, transition, type StoredLocation } from "@/lib/domain/locationGame";

async function activateLocation() {
  fireEvent.click(
    screen.getByRole("button", { name: /^(Activeren|Quiz hervatten|Bekijk resultaat)$/ })
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
}

let locations: StoredLocation[];
let resetId: string | undefined;
beforeEach(() => {
  localStorage.clear();
  resetId = undefined;
  locations = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1),
    status: "locked",
    quiz: {
      name: index === 0 ? "Café Rood/Wit" : `Locatie ${index + 1}`,
      question: "Welke spreuk is echt?",
      answers: ["Prik & Tik", "B", "C", "D"],
      correct: 0,
      bonus: "Ruil 1 pils voor 1 sneeuw"
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
      return {
        ok: true,
        json: async () => ({ locations: locations.map(publicLocation), resetId })
      };
    })
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it.each([17, 18, 19])(
  "routes petanque score %i to the wheel or 30 Snow without duplicate rewards",
  async (score) => {
    locations[5].quiz = {
      type: "score",
      name: "Petanque",
      question: "Speel petanque.",
      answers: ["", "", "", ""],
      correct: -1,
      bonus: "+30 Sneeuw"
    };
    locations[5].status = "available";
    render(<JourneyMapShell />);
    fireEvent.click(await screen.findByRole("button", { name: /6. Petanque — Beschikbaar/ }));
    await activateLocation();
    fireEvent.change(screen.getByRole("spinbutton", { name: "Behaalde score" }), {
      target: { value: String(score) }
    });
    fireEvent.click(screen.getByRole("button", { name: "Bevestig score" }));
    if (score < 18) {
      await screen.findByText("Het rad draait…");
      expect(screen.queryByRole("button", { name: "Naar de map" })).not.toBeInTheDocument();
    } else {
      await screen.findByText("Proef geslaagd!");
      expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
      await screen.findByRole("heading", { name: "Weer samen." });
      fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
      expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Draai voor de traktatie" })
      ).not.toBeInTheDocument();
    }
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory") ?? "{}").Sneeuw ?? 0).toBe(
      score >= 18 ? 30 : 0
    );
    act(() => window.dispatchEvent(new Event("online")));
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(JSON.parse(localStorage.getItem("rattan-journey-inventory") ?? "{}").Sneeuw ?? 0).toBe(
      score >= 18 ? 30 : 0
    );
  }
);

it("receives an admin reset on the player's device, clears resources and cards and closes the quiz", async () => {
  localStorage.setItem(
    "rattan-journey-inventory",
    JSON.stringify({ Gerst: 7, Salmari: 2, Sneeuw: 3 })
  );
  localStorage.setItem("rattan-development-cards", '["bierpaleis"]');
  locations[0].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(
    await screen.findByRole("button", { name: /1. Café Rood\/Wit — Quiz hervatten/ })
  );
  await activateLocation();
  expect(screen.getAllByRole("radio")).toHaveLength(4);
  locations.forEach((location) => {
    location.status = "locked";
  });
  resetId = "admin-reset";
  act(() => window.dispatchEvent(new Event("online")));
  await screen.findByRole("button", { name: /1. Locatie 1 — Op slot/ });
  expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Gerst: 0, bekijk opties" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Salmari: 0, bekijk opties" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sneeuw: 0, bekijk opties" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ontwikkelingskaarten: 0" })).toBeInTheDocument();
});

it("keeps locked hexagons closed, notices an unlock and completes the location quiz", async () => {
  locations[0].quiz.story = "Het spoor begint in Café Rood/Wit.";
  const vibrate = vi.fn();
  Object.defineProperty(navigator, "vibrate", { configurable: true, value: vibrate });
  render(<JourneyMapShell />);
  const first = await screen.findByRole("button", { name: /1. Locatie 1 — Op slot/ });
  fireEvent.click(first);
  expect(screen.getByRole("dialog")).toHaveTextContent("nog op slot");
  expect(screen.queryByText("Café Rood/Wit")).not.toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /Psychedelische illustratie/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Activeren" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Terug" }));
  transition(locations[0], "unlock");
  act(() => window.dispatchEvent(new Event("online")));
  await screen.findByText("Nieuwe locatie ontgrendeld: Café Rood/Wit!");
  expect(vibrate).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /1. Café Rood\/Wit — Beschikbaar/ }));
  expect(screen.getByRole("heading", { name: "Café Rood/Wit" })).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toHaveTextContent("Het spoor begint in Café Rood/Wit.");
  expect(document.querySelector('img[src*="cafe-rood-wit"]')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Activeren" }));
  await screen.findByRole("group", { name: "Welke spreuk is echt?" });
  expect(document.querySelector('img[src*="cafe-rood-wit"]')).not.toBeInTheDocument();
  expect(screen.getByText("Lees meer over deze locatie").closest("details")).not.toHaveAttribute(
    "open"
  );
  expect(screen.getByRole("heading", { name: "Ruil 1 pils voor 1 sneeuw" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Start quiz" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Bevestig antwoord" })).toBeDisabled();
  fireEvent.click(screen.getByRole("radio", { name: "A. Prik & Tik" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await screen.findByText("Gekozen antwoord");
  expect(screen.getByText("✓ Goed geantwoord!")).toBeInTheDocument();
  expect(document.querySelector('img[src*="cafe-rood-wit"]')).toBeInTheDocument();
  expect(screen.queryByText("Lees meer over deze locatie")).not.toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "Ontwikkelingskaart" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("link", { name: "Ontwikkelingskaarten: 1" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /1. Café Rood\/Wit — Afgerond/ }));
  await activateLocation();
  await screen.findByText("Gekozen antwoord");
  expect(screen.getByText("Prik & Tik", { exact: true })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Welke spreuk is echt?" })).toBeInTheDocument();
  expect(screen.queryByText("Deze locatie is afgerond.")).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Café Rood/Wit" })).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Bekijk je ontwikkelingskaarten" })
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Bevestig antwoord" })).not.toBeInTheDocument();
});

it("resumes a started quiz after reloading and keeps the quiz open when saving fails", async () => {
  locations[0].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(
    await screen.findByRole("button", { name: /1. Café Rood\/Wit — Quiz hervatten/ })
  );
  await activateLocation();
  await screen.findByRole("radio", { name: "A. Prik & Tik" });
  vi.mocked(fetch).mockRejectedValueOnce(new Error("Geen verbinding"));
  fireEvent.click(screen.getByRole("radio", { name: "A. Prik & Tik" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Geen verbinding"));
  expect(locations[0].status).toBe("started");
  expect(screen.getByRole("button", { name: "Bevestig antwoord" })).toBeEnabled();
});

it("reveals the reunion after the last quiz result, even with a wrong answer, and can replay it", async () => {
  locations.slice(0, 5).forEach((location) => {
    location.status = "completed";
    location.answer = 0;
  });
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true }))
  );
  locations[5].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /6. Locatie 6 — Quiz hervatten/ }));
  await activateLocation();
  fireEvent.click(await screen.findByRole("radio", { name: "B. B" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await screen.findByText("Gekozen antwoord");
  expect(screen.getByText("B", { exact: true })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Welke spreuk is echt?" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Draai voor de traktatie" })).not.toBeInTheDocument();
  await screen.findByRole("button", { name: "Naar de map" });
  expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("heading", { name: "Weer samen." })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  fireEvent.click(screen.getByRole("button", { name: "Bekijk de finale" }));
  expect(screen.getByRole("heading", { name: "Weer samen." })).toBeInTheDocument();
});

it("keeps the map visible on reopening a completed journey and allows replaying the finale", async () => {
  locations.forEach((location) => {
    location.status = "completed";
    location.answer = 0;
  });
  const view = render(<JourneyMapShell />);
  await screen.findByRole("button", { name: "Bekijk de finale" });
  expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Bekijk de finale" }));
  expect(screen.getByRole("heading", { name: "Weer samen." })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  view.unmount();
  const reopened = render(<JourneyMapShell />);
  await screen.findByRole("button", { name: "Bekijk de finale" });
  expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
  reopened.unmount();
  locations[5].status = "available";
  render(<JourneyMapShell />);
  await screen.findByRole("button", { name: /6. Locatie 6 — Beschikbaar/ });
  expect(screen.queryByRole("heading", { name: "Weer samen." })).not.toBeInTheDocument();
});

it("credits the Skins purchase reward immediately and offers the Only Cheese exchange", async () => {
  locations[0].quiz = {
    ...locations[0].quiz,
    type: "purchase",
    bonus: "+3 Gerst, +3 Salmari ,+ 3 Sneeuw"
  };
  locations[0].status = "started";
  const view = render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /1. Café Rood\/Wit/ }));
  await activateLocation();
  fireEvent.click(await screen.findByRole("button", { name: "Ik heb de aankoop gedaan" }));
  await screen.findByText("Beloning bijgeschreven in je voorraad");
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("button", { name: "Gerst: 3, bekijk opties" })).toBeInTheDocument();
  view.unmount();
  locations[1].quiz = {
    ...locations[1].quiz,
    type: "purchase",
    bonus: "2 gerst = 1 salmari + 1 sneeuw"
  };
  locations[1].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /2. Locatie 2/ }));
  await activateLocation();
  fireEvent.click(await screen.findByRole("button", { name: "Ik heb de aankoop gedaan" }));
  fireEvent.click(await screen.findByRole("button", { name: "Voer ruil uit" }));
  expect(screen.getByText("Ruil uitgevoerd · kaart gebruikt")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("button", { name: "Gerst: 1, bekijk opties" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Salmari: 4, bekijk opties" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sneeuw: 4, bekijk opties" })).toBeInTheDocument();
});

it("opens released locations even when their quiz is not complete", async () => {
  locations[1].quiz.question = "";
  transition(locations[1], "unlock");
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /2. Locatie 2 — Beschikbaar/ }));
  await activateLocation();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await screen.findByRole("heading", { name: "Locatie 2" });
  expect(screen.getByText("De quiz voor deze locatie wordt nog aangevuld.")).toBeInTheDocument();
  expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Bevestig antwoord" })).not.toBeInTheDocument();
  expect(locations[1].status).toBe("available");
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("button", { name: /2. Locatie 2 — Beschikbaar/ })).toBeInTheDocument();
});

it("opens a physical assignment even when its answers and reward are empty", async () => {
  locations[2].quiz.question = "Kies een kaas die je nog nooit hebt geprobeerd.";
  locations[2].quiz.story = "Volg het spoor van Ratthew.";
  locations[2].quiz.answers = ["", "", "", ""];
  locations[2].quiz.bonus = "";
  transition(locations[2], "unlock");
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /3. Locatie 3 — Beschikbaar/ }));
  await activateLocation();
  expect(screen.getByRole("heading", { name: "Locatie 3" })).toBeInTheDocument();
  expect(screen.getByText("Volg het spoor van Ratthew.")).toBeInTheDocument();
  expect(screen.getByText("Kies een kaas die je nog nooit hebt geprobeerd.")).toBeInTheDocument();
  expect(screen.queryByRole("radio")).not.toBeInTheDocument();
});

it.each(["purchase", "score"] as const)(
  "completes a %s quest without quiz answers",
  async (type) => {
    locations[0].status = "started";
    locations[0].quiz = {
      type,
      name: "Fysieke opdracht",
      question: type === "purchase" ? "Koop een kaas." : "Vul je score in.",
      answers: ["", "", "", ""],
      correct: -1,
      bonus: ""
    };
    render(<JourneyMapShell />);
    fireEvent.click(await screen.findByRole("button", { name: /1. Fysieke opdracht/ }));
    await activateLocation();
    await screen.findByRole("button", {
      name: type === "purchase" ? "Ik heb de aankoop gedaan" : "Bevestig score"
    });
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    if (type === "score") {
      expect(screen.getByRole("button", { name: "Bevestig score" })).toBeDisabled();
      fireEvent.change(screen.getByRole("spinbutton", { name: "Behaalde score" }), {
        target: { value: "13" }
      });
    }
    fireEvent.click(
      screen.getByRole("button", {
        name: type === "purchase" ? "Ik heb de aankoop gedaan" : "Bevestig score"
      })
    );
    await screen.findByText("Quest afgerond!");
    expect(locations[0].answer).toBe(type === "purchase" ? 1 : 13);
    expect(screen.queryByText("Matthew trakteert!")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
    expect(screen.getByRole("link", { name: "Ontwikkelingskaarten: 0" })).toBeInTheDocument();
  }
);

it("shows and accepts quiz answers without a configured reward", async () => {
  locations[0].quiz.bonus = "";
  transition(locations[0], "unlock");
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /1. Café Rood\/Wit — Beschikbaar/ }));
  fireEvent.click(screen.getByRole("button", { name: "Activeren" }));
  fireEvent.click(await screen.findByRole("radio", { name: "A. Prik & Tik" }));
  expect(screen.getAllByRole("radio")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await screen.findByText("Gekozen antwoord");
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(screen.getByRole("link", { name: "Ontwikkelingskaarten: 0" })).toBeInTheDocument();
});

it.each([0, 1, 2, 3, 4, 5])(
  "opens location %i info first and activates directly into the quiz",
  async (index) => {
    transition(locations[index], "unlock");
    render(<JourneyMapShell />);
    const button = await screen.findByRole("button", {
      name: new RegExp(`^${index + 1}\\. .* — Beschikbaar$`)
    });
    vi.mocked(fetch).mockClear();
    fireEvent.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    await activateLocation();
    expect(screen.getByRole("heading", { name: locations[index].quiz.name })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.queryByRole("button", { name: "Start quiz" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
    expect(
      screen.getByRole("button", { name: new RegExp(`^${index + 1}\\. .* — Quiz hervatten$`) })
    ).toBeInTheDocument();
  }
);

it("keeps a location open and allows returning when starting its quiz fails", async () => {
  transition(locations[0], "unlock");
  render(<JourneyMapShell />);
  fireEvent.click(await screen.findByRole("button", { name: /1. Café Rood\/Wit — Beschikbaar/ }));
  vi.mocked(fetch).mockRejectedValueOnce(new Error("Geen verbinding"));
  fireEvent.click(screen.getByRole("button", { name: "Activeren" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Geen verbinding"));
  expect(screen.getByRole("heading", { name: "Café Rood/Wit" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Terug" }));
  expect(
    screen.getByRole("button", { name: /1. Café Rood\/Wit — Beschikbaar/ })
  ).toBeInTheDocument();
});

it("shows the wheel after a wrong answer but omits it when reopening the result", async () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true }))
  );
  locations[0].status = "started";
  render(<JourneyMapShell />);
  fireEvent.click(
    await screen.findByRole("button", { name: /1. Café Rood\/Wit — Quiz hervatten/ })
  );
  await activateLocation();
  fireEvent.click(screen.getByRole("radio", { name: "B. B" }));
  fireEvent.click(screen.getByRole("button", { name: "Bevestig antwoord" }));
  await screen.findByText("Matthew trakteert!");
  fireEvent.click(await screen.findByRole("button", { name: "Naar de map" }));

  fireEvent.click(screen.getByRole("button", { name: /1. Café Rood\/Wit — Afgerond/ }));
  await activateLocation();
  expect(screen.getByRole("heading", { name: "Welke spreuk is echt?" })).toBeInTheDocument();
  expect(screen.getByText("B", { exact: true })).toBeInTheDocument();
  expect(screen.queryByText("Matthew trakteert!")).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Het rattenrad" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Naar de map" })).toBeEnabled();
});
