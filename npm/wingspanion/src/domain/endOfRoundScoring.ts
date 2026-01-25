export type RoundNumber = 1 | 2 | 3 | 4;

/**
 * Placement according to Wingspan rules:
 * 1 = first place
 * 2 = second place
 * 3 = third place
 * 0 = did not qualify / no points
 */
export type Placement = 0 | 1 | 2 | 3;

export type EndOfRoundPlacements = {
  round1: Placement;
  round2: Placement;
  round3: Placement;
  round4: Placement;
};

/**
 * How end-of-round goals are scored
 */
export type EndOfRoundScoringMode =
  | "numeric"   // players enter final points directly
  | "ranked";   // players enter placements (1st / 2nd / etc.)

/**
 * Official Wingspan end-of-round scoring table
 */
export const END_OF_ROUND_POINTS_BY_ROUND: Record<
  RoundNumber,
  Record<Placement, number>
> = {
  1: { 1: 4, 2: 1, 3: 0, 0: 0 },
  2: { 1: 5, 2: 2, 3: 1, 0: 0 },
  3: { 1: 6, 2: 3, 3: 2, 0: 0 },
  4: { 1: 7, 2: 4, 3: 3, 0: 0 },
};

/**
 * Numeric mode:
 * The input already represents final points.
 * No transformation required.
 */
export function scoreEndOfRoundNumeric(
  values: number[]
): number[] {
  return [...values];
}

/**
 * Ranked mode:
 * Resolve placements into points using Wingspan tie rules.
 */
export function scoreEndOfRoundRanked(
  placements: Placement[],
  round: RoundNumber
): number[] {
  const scoring = END_OF_ROUND_POINTS_BY_ROUND[round];
  const result = new Array<number>(placements.length).fill(0);

  // Group player indices by placement
  const groups = new Map<Placement, number[]>();

  placements.forEach((placement, index) => {
    if (!groups.has(placement)) {
      groups.set(placement, []);
    }
    groups.get(placement)!.push(index);
  });

  const orderedPlacements: Placement[] = [1, 2, 3];

  for (let i = 0; i < orderedPlacements.length; i++) {
    const placement = orderedPlacements[i];
    const playersInGroup = groups.get(placement);

    if (!playersInGroup || playersInGroup.length === 0) {
      continue;
    }

    // Tie handling:
    // Sum points for the occupied placements and divide evenly
    const tieSize = playersInGroup.length;
    let totalPoints = 0;

    for (let j = 0; j < tieSize; j++) {
      const p = orderedPlacements[i + j];
      if (p !== undefined) {
        totalPoints += scoring[p];
      }
    }

    const pointsEach = Math.floor(totalPoints / tieSize);
    playersInGroup.forEach(idx => {
      result[idx] = pointsEach;
    });

    i += tieSize - 1;
  }

  return result;
}

/**
 * Unified entry point used by the app.
 */
export function resolveEndOfRoundScores(args: {
  mode: EndOfRoundScoringMode;
  values: number[] | Placement[];
  round: RoundNumber;
}): number[] {
  if (args.mode === "numeric") {
    return scoreEndOfRoundNumeric(args.values as number[]);
  }

  return scoreEndOfRoundRanked(
    args.values as Placement[],
    args.round
  );
}
