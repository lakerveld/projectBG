const setupSteps = [
  "Create a local game",
  "Add table players",
  "Assign player colors",
  "Start from the shared dashboard"
];

export function PlayerSetupPreview() {
  return (
    <ol className="grid gap-3">
      {setupSteps.map((step, index) => (
        <li
          className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-parchment-edge bg-[#f6d9ef]/40 px-3 font-body text-sm font-semibold text-sepia"
          key={step}
        >
          <span className="grid size-7 place-items-center rounded-full bg-gold font-display text-xs font-black text-night-deep shadow-carved">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
