import type { CategoryId, InputCategoryId } from "./scoringCategories";

export type ScoringMode =
  | "numeric"
  | "placement"
  | "derived";

export type ScoringOption =
  | {
      categoryId: InputCategoryId;
      mode: "numeric";
    }
  | {
      categoryId: "end_of_round_goals";
      mode: "placement";
      options: {
        usePlacementScoring: boolean;
      };
    }
  | {
      categoryId: "nectar_score";
      mode: "derived";
    };

export const SCORING_OPTIONS: Record<CategoryId, ScoringOption> = {
  bird_scores: { categoryId: "bird_scores", mode: "numeric" },
  bonus_cards: { categoryId: "bonus_cards", mode: "numeric" },
  eggs: { categoryId: "eggs", mode: "numeric" },
  cached_food: { categoryId: "cached_food", mode: "numeric" },
  tucked_cards: { categoryId: "tucked_cards", mode: "numeric" },

  nectar_forest: { categoryId: "nectar_forest", mode: "numeric" },
  nectar_grassland: { categoryId: "nectar_grassland", mode: "numeric" },
  nectar_wetland: { categoryId: "nectar_wetland", mode: "numeric" },

  end_of_round_goals: {
    categoryId: "end_of_round_goals",
    mode: "placement",
    options: { usePlacementScoring: true },
  },

  nectar_score: {
    categoryId: "nectar_score",
    mode: "derived",
  },

  hummingbird_scores: {
    categoryId: "hummingbird_scores",
    mode: "numeric",
  },
};