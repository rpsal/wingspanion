const BASE = import.meta.env.BASE_URL;

export type AvatarId =
  | "bird1"
  | "bird2"
  | "bird3"
  | "bird4"
  | "bird5";

export const AVATAR_IDS: AvatarId[] = [
  "bird1",
  "bird2",
  "bird3",
  "bird4",
  "bird5",
];

export const AVATARS: Record<AvatarId, string> = {
  bird1: `${BASE}avatars/bird.png`,
  bird2: `${BASE}avatars/bird.png`,
  bird3: `${BASE}avatars/bird.png`,
  bird4: `${BASE}avatars/bird.png`,
  bird5: `${BASE}avatars/bird.png`,
};