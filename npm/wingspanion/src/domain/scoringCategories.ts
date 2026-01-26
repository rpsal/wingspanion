export const ALL_CATEGORIES = [
  "bird_scores",
  "bonus_cards",
  "end_of_round_goals",
  "eggs",
  "cached_food",
  "tucked_cards",
  "nectar_forest", 
  "nectar_grassland", 
  "nectar_wetland", 
  "nectar_score",
  "hummingbird_scores"
] as const;

export const BASE_CATEGORIES = [
  "bird_scores",
  "bonus_cards",
  "end_of_round_goals",
  "eggs",
  "cached_food",
  "tucked_cards",
] as const;

export const OCEANIA_CATEGORIES = [
  "nectar_forest", 
  "nectar_grassland", 
  "nectar_wetland", 
  "nectar_score"
] as const;

export const AMERICAS_CATEGORIES = [
  "hummingbird_scores"
] as const;

export const INPUT_CATEGORIES = [
  "bird_scores",
  "bonus_cards",
  "eggs",
  "cached_food",
  "tucked_cards",
  "nectar_forest",
  "nectar_grassland",
  "nectar_wetland",
  "hummingbird_scores",
] as const;

export const RANKED_CATEGORIES = [
  "end_of_round_goals",
] as const;

export const DERIVED_CATEGORIES = [
  "nectar_score",
] as const;

export type InputCategoryId = typeof INPUT_CATEGORIES[number];
export type DerivedCategoryId = typeof DERIVED_CATEGORIES[number];
export type RankedCategoryId = typeof RANKED_CATEGORIES[number];

export type CategoryId = InputCategoryId | DerivedCategoryId | RankedCategoryId;

export function getCategoriesForExpansions(expansions: string[]): string[] {
  const categories: string[] = [...BASE_CATEGORIES];

  if (expansions.includes("oceania")) categories.push(...OCEANIA_CATEGORIES);
  if (expansions.includes("americas")) categories.push(...AMERICAS_CATEGORIES);

  // Filter out derived categories
  return categories.filter(cat => !DERIVED_CATEGORIES.includes(cat as DerivedCategoryId));
}

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
  nectar_score: "Nectar Scores",
  hummingbird_scores: "Hummingbird Scores",
};