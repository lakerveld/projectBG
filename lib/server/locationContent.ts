import { readFile } from "node:fs/promises";
import path from "node:path";
import type { LocationQuizContent } from "@/lib/domain/locationGame";

export function parseLocationContent(markdown: string): LocationQuizContent[] {
  const blocks = markdown.split(/^## /m).slice(1);
  return Array.from({ length: 8 }, (_, index) => {
    const block = blocks.find((item) => item.startsWith(`${index + 1} | `));
    if (!block) throw new Error(`Locatie ${index + 1} ontbreekt in content/locatiequizzen.md.`);
    const field = (key: string) =>
      block.match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m"))?.[1].trim() ?? "";
    return {
      name: block.split("\n")[0].split(" | ").slice(1).join(" | ").trim(),
      question: field("Vraag"),
      answers: ["A", "B", "C", "D"].map(field),
      correct: ["A", "B", "C", "D"].indexOf(field("Correct")),
      bonus: field("Bonus")
    };
  });
}

export async function loadLocationContent() {
  return parseLocationContent(
    await readFile(path.join(process.cwd(), "content/locatiequizzen.md"), "utf8")
  );
}
