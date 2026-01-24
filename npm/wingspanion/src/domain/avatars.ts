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
  bird1: "/avatars/bird.png",
  bird2: "/avatars/bird.png",
  bird3: "/avatars/bird.png",
  bird4: "/avatars/bird.png",
  bird5: "/avatars/bird.png",
};