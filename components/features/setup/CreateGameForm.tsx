"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Plus, Trash2, UsersRound } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { getPlayerAvatar, getRandomPlayerAvatar } from "@/lib/domain/avatars";
import { CURATED_PLAYER_COLORS, MAX_PLAYERS, MIN_PLAYERS } from "@/lib/domain/defaults";
import { useGameStore } from "@/lib/state/gameStore";

const inputClassName =
  "min-h-12 w-full rounded-xl border border-parchment-edge/70 bg-[#e6d7b4]/50 px-3 font-body text-base font-semibold text-sepia outline-none shadow-carved placeholder:text-sepia-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/30";

type PlayerDraft = {
  id: string;
  name: string;
  color: string;
  avatarId: string;
};

function createPlayerDraft(index: number, existingAvatarIds: string[] = []): PlayerDraft {
  const colorOption = CURATED_PLAYER_COLORS[index - 1] ?? CURATED_PLAYER_COLORS[0];

  return {
    id: `draft-player-${Date.now()}-${index}`,
    name: "",
    color: colorOption?.value ?? "#f3efe7",
    avatarId: getRandomPlayerAvatar(existingAvatarIds).id
  };
}

function createInitialPlayers(): PlayerDraft[] {
  const firstPlayer = createPlayerDraft(1);
  const secondPlayer = createPlayerDraft(2, [firstPlayer.avatarId]);

  return [firstPlayer, secondPlayer];
}

export function CreateGameForm() {
  const router = useRouter();
  const createLocalGame = useGameStore((state) => state.createLocalGame);
  const saveStatus = useGameStore((state) => state.saveStatus);
  const storeError = useGameStore((state) => state.error);

  const [players, setPlayers] = useState<PlayerDraft[]>(createInitialPlayers);
  const [formError, setFormError] = useState<string | null>(null);
  const [removeCandidateId, setRemoveCandidateId] = useState<string | null>(null);

  const isSubmitting = saveStatus === "saving";
  const normalizedPlayerNames = players.map((player) => player.name.trim().toLocaleLowerCase());
  const playerColors = players.map((player) => player.color);
  const canContinue =
    players.length >= MIN_PLAYERS &&
    players.every((player) => Boolean(player.name.trim())) &&
    new Set(normalizedPlayerNames).size === normalizedPlayerNames.length &&
    new Set(playerColors).size === playerColors.length;

  function markSetupDirty() {
    setFormError(null);
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

    const game = await createLocalGame({
      rulesetPreset: "original-mvp",
      playerColorMode: "curated",
      players: normalizedPlayers.map((player) => ({
        name: player.name,
        color: player.color,
        avatarId: player.avatarId
      }))
    });

    if (game) {
      router.push("/king");
    }
  }

  function addPlayer() {
    if (players.length >= MAX_PLAYERS) {
      return;
    }

    markSetupDirty();

    const nextColor =
      CURATED_PLAYER_COLORS.find((color) => players.every((player) => player.color !== color.value))
        ?.value ?? CURATED_PLAYER_COLORS[0]?.value ?? "#f3efe7";

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        ...createPlayerDraft(
          currentPlayers.length + 1,
          currentPlayers.map((player) => player.avatarId)
        ),
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
    if (playerId === players[0]?.id) {
      return;
    }

    markSetupDirty();
    setPlayers((currentPlayers) => currentPlayers.filter((player) => player.id !== playerId));
    setRemoveCandidateId(null);
  }

  const removeCandidate = players.find((player) => player.id === removeCandidateId);

  return (
    <form className="grid gap-4 pb-28" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        {players.map((player, index) => {
          const avatar = getPlayerAvatar(player.avatarId);
          const canRemovePlayer = index > 0;

          return (
            <ParchmentCard className="p-3" key={player.id}>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-[4px] bg-[#e6d7b4] shadow-carved"
                    style={{ borderColor: player.color }}
                    aria-hidden="true"
                  >
                    {avatar ? (
                      <Image
                        src={avatar.src}
                        alt=""
                        width={64}
                        height={64}
                        className="size-full object-cover"
                        draggable={false}
                      />
                    ) : null}
                  </span>

                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Player {index + 1} name</span>
                    <input
                      className={inputClassName}
                      maxLength={32}
                      onChange={(event) => updatePlayer(player.id, { name: event.target.value })}
                      placeholder={`Player ${index + 1}`}
                      value={player.name}
                    />
                  </label>

                  {canRemovePlayer ? (
                    <button
                      aria-label={`Remove player ${index + 1}`}
                      className="grid size-12 shrink-0 place-items-center rounded-full border border-[#6f2417] bg-ember text-parchment shadow-seal transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
                      onClick={() => setRemoveCandidateId(player.id)}
                      type="button"
                    >
                      <Trash2 size={20} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>

                <div>
                  <span className="sr-only">Player {index + 1} color</span>
                  <div className="grid grid-cols-4 gap-2">
                    {CURATED_PLAYER_COLORS.map((color) => {
                      const isSelected = player.color === color.value;
                      const isUsed = players.some(
                        (candidate) => candidate.id !== player.id && candidate.color === color.value
                      );

                      return (
                        <button
                          aria-label={`Choose ${color.label} for player ${index + 1}`}
                          className={`grid aspect-square min-h-10 place-items-center rounded-full border shadow-carved ${
                            isSelected ? "border-sepia ring-2 ring-gold" : "border-parchment-edge"
                          } ${isUsed ? "opacity-35" : ""}`}
                          disabled={isUsed}
                          key={color.value}
                          onClick={() => updatePlayer(player.id, { color: color.value })}
                          style={{ backgroundColor: color.value }}
                          type="button"
                        >
                          {isSelected ? (
                            <Check
                              size={18}
                              className={color.iconClassName}
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ParchmentCard>
          );
        })}
      </div>

      {formError || storeError ? (
        <p className="rounded-2xl border border-ember/50 bg-ember/10 p-3 font-body text-sm font-bold text-parchment">
          {formError ?? storeError}
        </p>
      ) : null}

      {players.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No realms have gathered"
          description="Add the first realm to begin writing this table's chronicle."
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gold/20 bg-night/95 px-4 py-3 shadow-glow backdrop-blur">
        <div className="mx-auto grid w-full max-w-md grid-cols-[auto_1fr] gap-3">
          <ActionButton
            className="min-h-14 px-4"
            disabled={players.length >= MAX_PLAYERS}
            icon={Plus}
            onClick={addPlayer}
            type="button"
            variant="iron"
          >
            Add player
          </ActionButton>
          <ActionButton
            className="min-h-14 text-base"
            disabled={!canContinue || isSubmitting}
            icon={Check}
            loading={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </ActionButton>
        </div>
      </div>

      <Modal
        open={Boolean(removeCandidate)}
        onClose={() => setRemoveCandidateId(null)}
        icon={Trash2}
        tone="ember"
        title="Remove this realm?"
        description={
          removeCandidate
            ? `${removeCandidate.name || "This unnamed realm"} will be removed from setup.`
            : undefined
        }
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setRemoveCandidateId(null)}>
              Keep
            </ActionButton>
            <ActionButton
              variant="ember"
              icon={Trash2}
              onClick={() => {
                if (removeCandidate) removePlayer(removeCandidate.id);
              }}
            >
              Remove
            </ActionButton>
          </>
        }
      />
    </form>
  );
}
