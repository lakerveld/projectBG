import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "./page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("onboarding entrance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
    );
    vi.stubGlobal("scrollTo", vi.fn());
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("waits for artwork, reveals controls after shrinking, and does not replay on the next step", async () => {
    const { container } = render(<HomePage />);
    const overlay = container.querySelector<HTMLImageElement>('img[alt=""]')!;
    const animation = { onfinish: null as (() => void) | null, cancel: vi.fn() };
    const animate = vi.fn(() => animation);
    Object.defineProperty(overlay.parentElement!, "animate", { value: animate });
    expect(container.querySelector("section")).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");
    act(() => vi.runOnlyPendingTimers());
    expect(animate).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.load(overlay);
    });
    act(() => vi.runOnlyPendingTimers());
    expect(animate).toHaveBeenCalledOnce();
    act(() => animation.onfinish!());
    expect(container.querySelector('img[alt=""]')).not.toBeInTheDocument();
    expect(container.querySelector("section")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Matthew, die iemand ben jij.")).toBeInTheDocument();
    expect(animate).toHaveBeenCalledOnce();
  });

  it("skips the introduction when reduced motion is preferred", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaQueryList);
    const { container } = render(<HomePage />);
    act(() => vi.runOnlyPendingTimers());
    expect(container.querySelector("section")).not.toHaveAttribute("inert");
    expect(container.querySelector('img[alt=""]')).not.toBeInTheDocument();
  });

  it("unlocks the onboarding if the fullscreen illustration fails to load", () => {
    const { container } = render(<HomePage />);
    fireEvent.error(container.querySelector('img[alt=""]')!);
    expect(container.querySelector("section")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
  });
});
