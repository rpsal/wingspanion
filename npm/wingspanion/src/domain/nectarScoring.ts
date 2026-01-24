export type NectarCounts = number[];
export type NectarScores = number[];

export type NectarCategory =
  | "nectar_forest"
  | "nectar_grassland"
  | "nectar_wetland";

export const NECTAR_CATEGORIES: NectarCategory[] = [
  "nectar_forest",
  "nectar_grassland",
  "nectar_wetland",
];

export type PlayerNectarInput = Record<NectarCategory, number>;

const NECTAR_PLACEMENT_POINTS = {
  first: 5,
  second: 2,
};

function resolveSingleNectarCategory(
  values: number[]
): number[] {
  const result = new Array(values.length).fill(0);

  // Build sortable entries
  const entries = values
    .map((value, index) => ({ value, index }))
    .filter(e => e.value > 0);

  if (entries.length === 0) return result;

  // Sort descending
  entries.sort((a, b) => b.value - a.value);

  const groups = new Map<number, number[]>();

  for (const e of entries) {
    if (!groups.has(e.value)) groups.set(e.value, []);
    groups.get(e.value)!.push(e.index);
  }

  const placements = Array.from(groups.values());

  // First place
  if (placements[0]) {
    const split = Math.ceil(
      NECTAR_PLACEMENT_POINTS.first / placements[0].length
    );
    placements[0].forEach(i => (result[i] += split));
  }

  // Second place
  if (placements[1]) {
    const split = Math.ceil(
      NECTAR_PLACEMENT_POINTS.second / placements[1].length
    );
    placements[1].forEach(i => (result[i] += split));
  }

  return result;
}

export function resolveNectarScores(
  players: PlayerNectarInput[]
): number[] {
  const totals = new Array(players.length).fill(0);

  const categories: NectarCategory[] = [
    "nectar_forest",
    "nectar_grassland",
    "nectar_wetland",
  ];

  for (const category of categories) {
    const values = players.map(p => p[category] ?? 0);
    const scores = resolveSingleNectarCategory(values);

    scores.forEach((score, i) => {
      totals[i] += score;
    });
  }

  return totals;
}