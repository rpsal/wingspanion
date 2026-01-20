export type EndOfRoundPlacement = 0 | 1 | 2 | 3;
export type RoundNumber = 1 | 2 | 3 | 4;

export const END_OF_ROUND_POINTS_BY_ROUND: Record<
  RoundNumber,
  Record<EndOfRoundPlacement, number>
> = {
  1: { 1: 4, 2: 1, 3: 0, 0: 0 },
  2: { 1: 5, 2: 2, 3: 1, 0: 0 },
  3: { 1: 6, 2: 3, 3: 2, 0: 0 },
  4: { 1: 7, 2: 4, 3: 3, 0: 0 },
};

export function resolveEndOfRoundScores(
  placements: EndOfRoundPlacement[],
  round: RoundNumber
): number[] {
  const result = new Array<number>(placements.length).fill(0);
  const scoring = END_OF_ROUND_POINTS_BY_ROUND[round];

  const groups = new Map<EndOfRoundPlacement, number[]>();

  placements.forEach((p, i) => {
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p)!.push(i);
  });

  const ordered: EndOfRoundPlacement[] = [1, 2, 3];

  for (let i = 0; i < ordered.length; i++) {
    const placement = ordered[i];
    const players = groups.get(placement);
    if (!players || players.length === 0) continue;

    const tieSize = players.length;
    let total = 0;

    for (let j = 0; j < tieSize; j++) {
      const next = ordered[i + j];
      if (next !== undefined) {
        total += scoring[next];
      }
    }

    const each = Math.floor(total / tieSize);
    players.forEach((idx) => (result[idx] = each));
    i += tieSize - 1;
  }

  return result;
}
