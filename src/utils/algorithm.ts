/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateTags } from '../data/tags';

export const DIMENSION_WEIGHTS = {
  LOVE: 0.30,
  VALUES: 0.25,
  HABITAT: 0.20,
  SONIC: 0.15,
  TIME: 0.10,
};

const COMPLEMENT_DIMS = ['LOVE', 'VALUES'];

function questionScore(a: number, b: number, isComplement: boolean): number {
  const diff = Math.abs(a - b);
  if (isComplement) {
    // Complementarity: 1 step apart is ideal
    if (diff === 1) return 1.0;
    if (diff === 0) return 0.6;  // too identical on attachment
    if (diff === 2) return 0.7;
    return 0.3; // diff === 3
  } else {
    // Similarity: same answer is ideal
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.65;
    if (diff === 2) return 0.35;
    return 0.15; // diff === 3
  }
}

function dimensionScore(
  userAAnswers: number[],  // 5 answers for this dimension
  userBAnswers: number[],
  dimension: string
): number {
  const isComplement = COMPLEMENT_DIMS.includes(dimension);
  const scores = userAAnswers.map((a, i) => questionScore(a, userBAnswers[i], isComplement));
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

export interface CompatibilityResult {
  rawScore: number;
  displayScore: number;
  dimensionBreakdown: Record<string, number>;
  dealbreaker: boolean;
  valuesFloored: boolean;
  tags: string[];
}

export function calculateCompatibility(
  userAAnswers: Record<string, number[]>,  // { SONIC: [0,1,2,3,0], HABITAT: [...], ... }
  userBAnswers: Record<string, number[]>,
): CompatibilityResult {
  const breakdown: Record<string, number> = {};

  // Calculate per-dimension scores
  for (const dim of Object.keys(DIMENSION_WEIGHTS)) {
    const dimKey = dim as keyof typeof DIMENSION_WEIGHTS;
    const aAns = userAAnswers[dimKey] || [0, 0, 0, 0, 0];
    const bAns = userBAnswers[dimKey] || [0, 0, 0, 0, 0];
    breakdown[dim] = dimensionScore(aAns, bAns, dim);
  }

  // Weighted sum
  let weighted = 0;
  for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    weighted += breakdown[dim] * weight * 100;
  }

  // Apply rules

  // Dealbreaker: conflict style mismatch
  // LOVE Q3 (index 2): A=0 (immediate), B=1 (wait), C=2 (hope surfaces), D=3 (write first)
  // A paired with B or C = dealbreaker
  const aConflict = userAAnswers['LOVE'] ? userAAnswers['LOVE'][2] : 0;
  const bConflict = userBAnswers['LOVE'] ? userBAnswers['LOVE'][2] : 0;
  const dealbreaker = (aConflict === 0 && (bConflict === 1 || bConflict === 2)) ||
                      (bConflict === 0 && (aConflict === 1 || aConflict === 2));
  if (dealbreaker) {
    weighted -= 30;
  }

  // Values floor
  const valuesFloored = breakdown['VALUES'] < 0.40;
  if (valuesFloored) {
    weighted = Math.min(weighted, 45);
  }

  // Clamp
  const rawScore = Math.max(0, Math.min(100, weighted));

  // Display score formula: raw [50,100] → display [70,99]
  // Scores below 50 never surface, so this is safe
  const displayScore = rawScore < 50
    ? 65 + Math.round(rawScore / 50 * 4) // Make it display a low score (e.g. 65-69) if under 50 but still rendering in secondary grids
    : 70 + Math.round((rawScore - 50) / 50 * 29);

  // Generate tags
  const tags = generateTags(userAAnswers, userBAnswers);

  return { 
    rawScore, 
    displayScore, 
    dimensionBreakdown: breakdown, 
    dealbreaker, 
    valuesFloored, 
    tags 
  };
}
