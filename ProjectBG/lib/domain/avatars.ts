export type PlayerAvatarId = "king" | "queen" | "wizard" | "bishop" | "general" | "merchant";

export type PlayerAvatar = {
  id: PlayerAvatarId;
  label: string;
  src: string;
};

export const PLAYER_AVATARS: PlayerAvatar[] = [
  { id: "king", label: "King", src: "/avatars/king.png" },
  { id: "queen", label: "Queen", src: "/avatars/queen.png" },
  { id: "wizard", label: "Wizard", src: "/avatars/wizard.png" },
  { id: "bishop", label: "Bishop", src: "/avatars/bishop.png" },
  { id: "general", label: "General", src: "/avatars/general.png" },
  { id: "merchant", label: "Merchant", src: "/avatars/merchant.png" }
];

export function getPlayerAvatar(avatarId?: string) {
  return PLAYER_AVATARS.find((avatar) => avatar.id === avatarId);
}

export function getRandomPlayerAvatar(excludedAvatarIds: string[] = []) {
  const availableAvatars = PLAYER_AVATARS.filter(
    (avatar) => !excludedAvatarIds.includes(avatar.id)
  );
  const avatarPool = availableAvatars.length > 0 ? availableAvatars : PLAYER_AVATARS;
  const randomIndex = Math.floor(Math.random() * avatarPool.length);

  return avatarPool[randomIndex] ?? PLAYER_AVATARS[0];
}
