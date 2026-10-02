import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TreatWheel } from "@/components/features/journey/TreatWheel";
import RattenradPage from "./page";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false }))
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it.each([
  [0, 0, "Levi", "Bier"],
  [0, 0.399999, "Levi", "Bier"],
  [0.1, 0.4, "Jordi", "Nakkie"],
  [0.2, 0.799999, "Matthew", "Nakkie"],
  [0.1125, 0.5, "Matthew", "Nakkie"],
  [0.387499, 0.5, "Matthew", "Nakkie"],
  [0.3875, 0.5, "Argyle", "Nakkie"],
  [0.6125, 0.5, "Matthew", "Nakkie"],
  [0.887499, 0.5, "Matthew", "Nakkie"],
  [0.8875, 0.5, "Argyle", "Nakkie"],
  [0.3875, 0.8, "Argyle", "Salmari shot"],
  [0.999, 0.999, "Dennis", "Salmari shot"]
])("completes two eight-second spins with draws %s and %s", (who, what, name, treat) => {
  const random = vi.spyOn(Math, "random").mockReturnValue(who as number);
  render(<RattenradPage />);
  fireEvent.click(screen.getByRole("button", { name: "RATATATATATA" }));
  expect(screen.getByRole("button")).toBeDisabled();
  act(() => vi.advanceTimersByTime(7999));
  expect(screen.queryByText(`${name} trakteert!`)).not.toBeInTheDocument();
  random.mockReturnValue(what as number);
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByText(`${name} trakteert!`)).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(document.querySelector(".robber-reel")).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(7999));
  expect(screen.getByRole("status")).toHaveTextContent("Het rad draait…");
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole("status")).toHaveTextContent(`${name} trakteert op ${treat}!`);
  fireEvent.click(screen.getByRole("button", { name: "Nog een ronde" }));
  expect(screen.getByRole("button", { name: "RATATATATATA" })).toBeEnabled();
});

it("skips both waits for reduced motion", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true }))
  );
  render(<RattenradPage />);
  fireEvent.click(screen.getByRole("button", { name: "RATATATATATA" }));
  act(() => vi.advanceTimersByTime(0));
  expect(screen.getByRole("button", { name: "Nog een ronde" })).toBeEnabled();
});

it.each([4000, 8000, 12000])("clears the active spin timer when leaving after %s ms", (elapsed) => {
  const { unmount } = render(<RattenradPage />);
  fireEvent.click(screen.getByRole("button", { name: "RATATATATATA" }));
  act(() => vi.advanceTimersByTime(elapsed));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("uses only one draw for the treat when Matthew answered incorrectly", () => {
  const random = vi.spyOn(Math, "random").mockReturnValue(0.9);
  const done = vi.fn();
  render(<TreatWheel onDone={done} />);
  expect(screen.getByText("Matthew trakteert!")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "RATATATATATA" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Draai voor de traktatie" }));
  expect(random).toHaveBeenCalledTimes(1);
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByRole("status")).toHaveTextContent("Matthew trakteert op Salmari shot!");
  fireEvent.click(screen.getByRole("button", { name: "Naar de map" }));
  expect(done).toHaveBeenCalledOnce();
});
