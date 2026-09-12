export const developmentCards = [
  {
    id: "bierpaleis",
    location: "Het Bierpaleis",
    bonus: "Ruil 1 bier voor 1 poedersuiker",
    description: "Bij de eerste handelspost van Rattan mag je 1 bier ruilen voor 1 poedersuiker."
  }
] as const;

export function parseEarnedCards(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return developmentCards.filter((card) => value.includes(card.id)).map((card) => card.id);
  } catch {
    return [];
  }
}
