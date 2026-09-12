export const locationPins = [
  { x: 48.3, y: 22.8, w: 18.3, h: 11.5 },
  { x: 27, y: 34.3, w: 20.5, h: 12.5 },
  { x: 79.4, y: 34.4, w: 20, h: 12.5 },
  { x: 47.8, y: 45.1, w: 20.5, h: 12.4 },
  { x: 27.4, y: 62.2, w: 20, h: 12.5 },
  { x: 75.7, y: 60.5, w: 20.5, h: 13 },
  { x: 33, y: 77.4, w: 20, h: 13.5 },
  { x: 70.2, y: 77.2, w: 20, h: 13.5 }
];

export type LocationQuizContent = {
  name: string;
  question: string;
  answers: string[];
  correct: number;
  bonus: string;
};
export type LocationState = "locked" | "available" | "started" | "completed";
export type StoredLocation = {
  id: string;
  status: LocationState;
  quiz: LocationQuizContent;
  answer?: number;
  unlockedAt?: number;
};
export type LocationView = {
  id: string;
  name: string;
  status: LocationState;
  ready: boolean;
  unlockedAt?: number;
  quiz?: Omit<LocationQuizContent, "correct">;
  result?: { correct: boolean; correctAnswer: string; bonus: string };
};
export type JourneyView = { locations: LocationView[] };

export function quizReady(quiz: LocationQuizContent) {
  return Boolean(
    quiz.name &&
    quiz.question &&
    quiz.bonus &&
    quiz.answers.length === 4 &&
    quiz.answers.every(Boolean) &&
    Number.isInteger(quiz.correct) &&
    quiz.correct >= 0 &&
    quiz.correct < 4
  );
}

export function publicLocation(location: StoredLocation): LocationView {
  const { correct, ...quiz } = location.quiz;
  return {
    id: location.id,
    name: quiz.name,
    status: location.status,
    ready: quizReady(location.quiz),
    unlockedAt: location.unlockedAt,
    ...(location.status === "started" || location.status === "completed" ? { quiz } : {}),
    ...(location.status === "completed"
      ? {
          result: {
            correct: location.answer === correct,
            correctAnswer: quiz.answers[correct],
            bonus: quiz.bonus
          }
        }
      : {})
  };
}

export function transition(location: StoredLocation, action: string, answer?: unknown) {
  if (action === "unlock") {
    if (location.status !== "locked") return;
    if (!quizReady(location.quiz))
      throw new Error("Vul eerst de quiz en beloning in het Markdown-bestand in.");
    location.status = "available";
    location.unlockedAt = Date.now();
  } else if (action === "start") {
    if (location.status === "locked") throw new Error("Deze locatie is nog op slot.");
    if (location.status === "available") location.status = "started";
  } else if (action === "answer") {
    if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer > 3)
      throw new Error("Kies één van de vier antwoorden.");
    if (location.status === "completed") return; // Retries cannot change the first result.
    if (location.status !== "started") throw new Error("Activeer deze locatie eerst.");
    location.answer = answer;
    location.status = "completed";
  } else throw new Error("Onbekende actie.");
}
