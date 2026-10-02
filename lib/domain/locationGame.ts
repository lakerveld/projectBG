export const locationPins = [
  { x: 30.4, y: 32.2, w: 24, h: 15 },
  { x: 72, y: 32.2, w: 24, h: 15 },
  { x: 30.4, y: 55.2, w: 24, h: 15 },
  { x: 72, y: 55.2, w: 24, h: 15 },
  { x: 30.4, y: 75.7, w: 24, h: 15 },
  { x: 72, y: 75.7, w: 24, h: 15 }
];

export type LocationQuizContent = {
  type?: "quiz" | "purchase" | "score";
  name: string;
  story?: string;
  question: string;
  answers: string[];
  correct: number;
  bonus: string;
};
export type LocationState = "locked" | "available" | "started" | "completed";
export type StoredLocation = {
  id: string;
  status: LocationState;
  statusBeforeLock?: Exclude<LocationState, "locked">;
  quiz: LocationQuizContent;
  contentOverride?: boolean;
  answer?: number;
  rewardId?: string;
  unlockedAt?: number;
};
export type LocationView = {
  id: string;
  name: string;
  status: LocationState;
  ready: boolean;
  image?: string;
  story?: string;
  unlockedAt?: number;
  quiz?: Omit<LocationQuizContent, "correct">;
  result?: {
    correct: boolean;
    correctAnswer: string;
    bonus: string;
    score?: number;
    rewardId?: string;
  };
};
export type JourneyView = { locations: LocationView[]; resetId?: string };

export function quizReady(quiz: LocationQuizContent) {
  if (quiz.type === "purchase" || quiz.type === "score") return Boolean(quiz.name && quiz.question);
  return Boolean(
    quiz.name &&
    quiz.question &&
    quiz.answers.length === 4 &&
    quiz.answers.every(Boolean) &&
    Number.isInteger(quiz.correct) &&
    quiz.correct >= 0 &&
    quiz.correct < 4
  );
}

const locationArtwork: Record<string, string> = {
  "1": "/locations/cafe-rood-wit.png",
  "2": "/locations/brouwerij-de-koninck.png",
  "3": "/locations/only-cheese.png",
  "4": "/locations/den-botaniek.png",
  "5": "/locations/skins.png",
  "6": "/locations/petanque-escape-room-cafe.png"
};

export function publicLocation(location: StoredLocation): LocationView {
  // Explicitly select public fields so legacy stored times are never exposed.
  const { type, correct, name, story, question, answers, bonus } = location.quiz;
  const petanque = location.id === "6" && type === "score";
  const quiz = { type, name, story, question, answers, bonus: petanque ? "+30 Sneeuw" : bonus };
  const revealed = location.status !== "locked";
  return {
    id: location.id,
    name: revealed ? quiz.name : `Locatie ${location.id}`,
    ...(revealed ? { story: quiz.story, image: locationArtwork[location.id] } : {}),
    status: location.status,
    ready: quizReady(location.quiz),
    unlockedAt: location.unlockedAt,
    ...((revealed && !quizReady(location.quiz)) ||
    location.status === "started" ||
    location.status === "completed"
      ? { quiz }
      : {}),
    ...(location.status === "completed"
      ? {
          result: {
            correct: petanque
              ? (location.answer ?? 0) >= 18
              : type === "purchase" || type === "score" || location.answer === correct,
            correctAnswer: quiz.answers[correct] ?? "",
            ...(type === "score" ? { score: location.answer } : {}),
            rewardId: location.rewardId,
            bonus: petanque && (location.answer ?? 0) < 18 ? "" : quiz.bonus
          }
        }
      : {})
  };
}

export function transition(location: StoredLocation, action: string, answer?: unknown) {
  if (action === "unlock") {
    if (location.status !== "locked") return;
    location.status = location.statusBeforeLock ?? "available";
    delete location.statusBeforeLock;
    location.unlockedAt = Date.now();
  } else if (action === "lock") {
    if (location.status === "locked") return;
    location.statusBeforeLock = location.status;
    location.status = "locked";
  } else if (action === "start") {
    if (location.status === "locked") throw new Error("Deze locatie is nog op slot.");
    if (!quizReady(location.quiz)) throw new Error("De quiz voor deze locatie is nog niet klaar.");
    if (location.status === "available") location.status = "started";
  } else if (action === "answer") {
    if (location.quiz.type === "purchase") {
      if (answer !== 1) throw new Error("Bevestig dat je de aankoop hebt gedaan.");
    } else if (location.quiz.type === "score") {
      if (typeof answer !== "number" || !Number.isSafeInteger(answer) || answer < 0)
        throw new Error("Vul een geldige score van nul of hoger in.");
    } else if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer > 3)
      throw new Error("Kies één van de vier antwoorden.");
    if (location.status === "completed") return; // Retries cannot change the first result.
    if (location.status !== "started") throw new Error("Activeer deze locatie eerst.");
    location.answer = answer;
    location.rewardId = crypto.randomUUID();
    location.status = "completed";
  } else throw new Error("Onbekende actie.");
}

export type AdminJourneyView = {
  resetId?: string;
  locations: (LocationView & { content: LocationQuizContent })[];
};
