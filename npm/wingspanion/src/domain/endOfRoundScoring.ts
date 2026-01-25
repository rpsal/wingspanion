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

export function isRoundPlacementValid(
  placements: Record<string, Placement>
): boolean {
  const values = Object.values(placements).filter(p => p !== 0);

  // Everyone "--" is valid
  if (values.length === 0) return true;

  const c1 = values.filter(p => p === 1).length;
  const c2 = values.filter(p => p === 2).length;
  const c3 = values.filter(p => p === 3).length;

  // If anyone is placed, there must be at least one 1st
  if (c1 === 0) return false;

  // No 2nd if 2+ firsts
  if (c1 >= 2 && c2 > 0) return false;

  // No 3rd unless at least 2 players are ahead
  if (c1 + c2 < 2 && c3 > 0) return false;

  return true;
}

const ALL_PLACEMENTS: Placement[] = [1, 2, 3, 0];

export function getValidPlacements(
  placements: Record<string, Placement>,
  currentPlayerId: string,
  totalPlayers: number
): Placement[] {
  const counts = { 1: 0, 2: 0, 3: 0 };

  Object.entries(placements).forEach(([pid, place]) => {
    if (pid === currentPlayerId) return;
    if (place !== 0) counts[place]++;
  });

  const valid = new Set<Placement>();

  // "--" always allowed
  valid.add(0);

  // 1st always allowed
  valid.add(1);

  // 2nd allowed only if fewer than 2 players are already 1st
  if (counts[1] < 2) {
    valid.add(2);
  }

  // 3rd allowed only if total podium slots are not exceeded
  const podiumCount = counts[1] + counts[2] + counts[3];
  if (podiumCount < totalPlayers && counts[1] + counts[2] < 3) {
    valid.add(3);
  }

  return ALL_PLACEMENTS.filter(p => valid.has(p));
}

export function normalizePlacementsForRound(
  placements: Record<string, Placement>,
  totalPlayers: number
): Record<string, Placement> {
  const normalized = { ...placements };

  Object.keys(normalized).forEach(playerId => {
    const validOptions = getValidPlacements(
      normalized,
      playerId,
      totalPlayers
    );

    if (!validOptions.includes(normalized[playerId])) {
      normalized[playerId] = 0; // reset to "--"
    }
  });

  return normalized;
}

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
