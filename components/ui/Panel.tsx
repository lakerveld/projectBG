import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="rounded-lg border border-line bg-panel p-4 shadow-soft">
      <h2 className="mb-3 text-base font-black text-ink">{title}</h2>
      {children}
    </section>
  );
}
