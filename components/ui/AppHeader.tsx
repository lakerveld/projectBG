type AppHeaderProps = {
  eyebrow: string;
  title: string;
};

export function AppHeader({ eyebrow, title }: AppHeaderProps) {
  return (
    <header className="grid gap-1">
      <p className="text-xs font-bold uppercase text-forest">{eyebrow}</p>
      <h1 className="text-3xl font-black text-ink">{title}</h1>
    </header>
  );
}
