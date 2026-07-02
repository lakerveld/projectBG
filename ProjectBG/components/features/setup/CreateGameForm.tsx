"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Plus, Trash2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { CURATED_PLAYER_COLORS, MAX_PLAYERS, MIN_PLAYERS } from "@/lib/domain/defaults";
import { useGameStore } from "@/lib/state/gameStore";

const inputClassName =
  "min-h-12 w-full rounded-lg border border-line bg-bg px-3 text-base font-semibold text-ink outline-none focus:border-forest";

type PlayerDraft = {
  id: string;
  name: string;
  color: string;
};

const initialPlayers: PlayerDraft[] = [
  {
    id: "draft-player-1",
    name: "",
    color: CURATED_PLAYER_COLORS[0] ?? "#b33a3a"
  },
  {
    id: "draft-player-2",
    name: "",
    color: CURATED_PLAYER_COLORS[1] ?? "#2f6db3"
  }
];

export function CreateGameForm() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const createLocalGame = useGameStore((state) => state.createLocalGame);
  const startLocalGame = useGameStore((state) => state.startLocalGame);
  const saveStatus = useGameStore((state) => state.saveStatus);
  const storeError = useGameStore((state) => state.error);

  const [players, setPlayers] = useState<PlayerDraft[]>(initialPlayers);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSelectingKing, setIsSelectingKing] = useState(false);
  const [selectionPreviewName, setSelectionPreviewName] = useState<string | null>(null);

  const isSubmitting = saveStatus === "saving";
  const canStartGame = Boolean(savedMessage) && game.players.length >= MIN_PLAYERS;

  function markSetupDirty() {
    setSavedMessage(null);
    setSelectionPreviewName(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPlayers = players.map((player) => ({
      ...player,
      name: player.name.trim()
    }));

    if (normalizedPlayers.length < MIN_PLAYERS) {
      setFormError(`Add at least ${MIN_PLAYERS} players.`);
      return;
    }

    if (normalizedPlayers.some((player) => !player.name)) {
      setFormError("Every player needs a name.");
      return;
    }

    const playerNames = normalizedPlayers.map((player) => player.name.toLocaleLowerCase());
    if (new Set(playerNames).size !== playerNames.length) {
      setFormError("Player names must be unique.");
      return;
    }

    const playerColors = normalizedPlayers.map((player) => player.color);
    if (new Set(playerColors).size !== playerColors.length) {
      setFormError("Player colors must be unique.");
      return;
    }

    setFormError(null);
    setSavedMessage(null);

    const game = await createLocalGame({
      rulesetPreset: "original-mvp",
      playerColorMode: "curated",
      players: normalizedPlayers.map((player) => ({
        name: player.name,
        color: player.color
      }))
    });

    if (game) {
      setSavedMessage(`${game.name} is saved locally with ${game.players.length} players.`);
    }
  }

  async function handleStartGame() {
    if (!canStartGame || isSelectingKing) {
      return;
    }

    setFormError(null);
    setIsSelectingKing(true);

    let previewIndex = 0;
    const intervalId = window.setInterval(() => {
      const previewPlayer = game.players[previewIndex % game.players.length];
      setSelectionPreviewName(previewPlayer?.name ?? null);
      previewIndex += 1;
    }, 120);

    window.setTimeout(async () => {
      window.clearInterval(intervalId);
      const startedGame = await startLocalGame();
      setIsSelectingKing(false);

      if (startedGame) {
        const king = startedGame.players.find((player) => player.id === startedGame.kingPlayerId);
        setSelectionPreviewName(king?.name ?? null);
        router.push("/game");
      }
    }, 1400);
  }

  function addPlayer() {
    if (players.length >= MAX_PLAYERS) {
      return;
    }

    markSetupDirty();

    const nextColor =
      CURATED_PLAYER_COLORS.find((color) => players.every((player) => player.color !== color)) ??
      CURATED_PLAYER_COLORS[0] ??
      "#b33a3a";

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        id: `draft-player-${Date.now()}-${currentPlayers.length + 1}`,
        name: "",
        color: nextColor
      }
    ]);
  }

  function updatePlayer(playerId: string, updates: Partial<PlayerDraft>) {
    markSetupDirty();
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              ...updates
            }
          : player
      )
    );
  }

  function removePlayer(playerId: string) {
    if (players.length <= MIN_PLAYERS) {
      return;
    }

    markSetupDirty();
    setPlayers((currentPlayers) => currentPlayers.filter((player) => player.id !== playerId));
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Panel title="Players">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-forest text-white">
            <UsersRound size={20} aria-hidden="true" />
          </span>
          <div className="grid gap-1">
            <p className="text-sm font-black text-ink">Name each player and pick a color</p>
            <p className="text-sm leading-6 text-muted">
              Add {MIN_PLAYERS}-{MAX_PLAYERS} players. Gameplay systems start after this setup flow.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {players.map((player, index) => (
            <div className="rounded-lg border border-line bg-bg p-3" key={player.id}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-ink">Player {index + 1}</p>
                <button
                  aria-label={`Remove player ${index + 1}`}
                  className="grid size-10 place-items-center rounded-lg border border-line bg-panel text-muted disabled:opacity-40"
                  disabled={players.length <= MIN_PLAYERS}
                  onClick={() => removePlayer(player.id)}
                  type="button"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>

              <label className="mb-3 grid gap-2">
                <span className="text-xs font-bold text-muted">Name</span>
                <input
                  className={inputClassName}
                  maxLength={32}
                  onChange={(event) => updatePlayer(player.id, { name: event.target.value })}
                  placeholder={`Player ${index + 1}`}
                  value={player.name}
                />
              </label>

              <div className="grid gap-2">
                <span className="text-xs font-bold text-muted">Color</span>
                <div className="grid grid-cols-6 gap-2">
                  {CURATED_PLAYER_COLORS.map((color) => {
                    const isSelected = player.color === color;
                    const isUsed = players.some(
                      (candidate) => candidate.id !== player.id && candidate.color === color
                    );

                    return (
                      <button
                        aria-label={`Choose color ${color} for player ${index + 1}`}
                        className={`grid aspect-square min-h-10 place-items-center rounded-lg border ${
                          isSelected ? "border-ink" : "border-line"
                        } ${isUsed ? "opacity-35" : ""}`}
                        disabled={isUsed}
                        key={color}
                        onClick={() => updatePlayer(player.id, { color })}
                        style={{ backgroundColor: color }}
                        type="button"
                      >
                        {isSelected ? <Check size={18} className="text-white" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="mt-4 w-full"
          disabled={players.length >= MAX_PLAYERS}
          onClick={addPlayer}
          type="button"
          variant="secondary"
        >
          <Plus size={18} aria-hidden="true" />
          Add player
        </Button>
      </Panel>

      {formError || storeError ? (
        <p className="rounded-lg border border-danger bg-panel p-3 text-sm font-bold text-danger">
          {formError ?? storeError}
        </p>
      ) : null}

      {savedMessage ? (
        <Panel title="Review players">
          <div className="grid gap-3">
            <p className="rounded-lg border border-forest bg-bg p-3 text-sm font-bold text-forest">
              {savedMessage}
            </p>
            <ul className="grid gap-2">
              {game.players.map((player) => (
                <li
                  className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-line bg-bg px-3"
                  key={player.id}
                >
                  <span className="truncate text-sm font-black text-ink">{player.name}</span>
                  <span
                    className="size-7 rounded-full border border-line"
                    style={{ backgroundColor: player.color }}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
            {selectionPreviewName ? (
              <p className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gold bg-bg px-3 text-sm font-black text-ink">
                <Crown size={18} aria-hidden="true" />
                {isSelectingKing ? `Selecting ${selectionPreviewName}` : `${selectionPreviewName} is King`}
              </p>
            ) : null}
            <Button
              className="min-h-14 text-base"
              disabled={!canStartGame || isSelectingKing}
              onClick={() => void handleStartGame()}
              type="button"
            >
              <Crown size={20} aria-hidden="true" />
              {isSelectingKing ? "Selecting King..." : "Start game"}
            </Button>
          </div>
        </Panel>
      ) : null}

      <Button className="min-h-14 text-base" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : "Create game"}
        <Check size={20} aria-hidden="true" />
      </Button>
    </form>
  );
}
