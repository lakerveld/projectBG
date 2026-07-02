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
          className="flex min-h-12 items-center gap-3 rounded-lg border border-line bg-bg px-3 text-sm font-semibold"
          key={step}
        >
          <span className="grid size-7 place-items-center rounded-full bg-forest text-xs font-black text-white">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}

