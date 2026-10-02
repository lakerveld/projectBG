export const locationPins = [
  { x: 30.4, y: 32.2, w: 24, h: 15 },
  { x: 72, y: 32.2, w: 24, h: 15 },
  { x: 30.4, y: 55.2, w: 24, h: 15 },
  { x: 72, y: 55.2, w: 24, h: 15 },
  { x: 30.4, y: 75.7, w: 24, h: 15 },
  { x: 72, y: 75.7, w: 24, h: 15 }
];

export type LocationQuizContent = {
  name: string;
  story?: string;
  time?: string;
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
  contentOverride?: boolean;
  answer?: number;
  unlockedAt?: number;
};
export type LocationView = {
  id: string;
  name: string;
  status: LocationState;
  ready: boolean;
  story?: string;
  time?: string;
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
    story: quiz.story,
    time: quiz.time,
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

export type AdminJourneyView = {
  locations: (LocationView & { content: LocationQuizContent })[];
};
