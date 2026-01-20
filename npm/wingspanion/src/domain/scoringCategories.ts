export const BASE_CATEGORIES = [
  "bird_scores",
  "bonus_cards",
  "end_of_round_goals",
  "eggs",
  "cached_food",
  "tucked_cards",
] as const;

export const OCEANIA_CATEGORIES = ["nectar_forest", "nectar_grassland", "nectar_wetland"] as const;

export const AMERICAS_CATEGORIES = ["hummingbird_scores"] as const;

export type CategoryId =
  | typeof BASE_CATEGORIES[number]
  | typeof OCEANIA_CATEGORIES[number]
  | typeof AMERICAS_CATEGORIES[number];

export const SCORING_CATEGORIES: CategoryId[] = [
  "bird_scores",
  "bonus_cards",
  "end_of_round_goals",
  "eggs",
  "cached_food",
  "tucked_cards",
  "nectar_forest",
  "nectar_grassland",
  "nectar_wetland",
  "hummingbird_scores",
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  bird_scores: "Bird Scores",
  bonus_cards: "Bonus Cards",
  end_of_round_goals: "End-of-Round Goals",
  eggs: "Eggs",
  cached_food: "Cached Food",
  tucked_cards: "Tucked Cards",
  nectar_forest: "Nectar on Forest",
  nectar_grassland: "Nectar on Grassland",
  nectar_wetland: "Nectar on Wetland",
  hummingbird_scores: "Hummingbird Scores",
};