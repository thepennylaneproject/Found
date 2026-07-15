/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Match, Message, CommunicationPref, Purchase, Gender, MatchStatus } from '../types';
import { SEEDED_PROFILES } from '../data/profiles';
import { calculateCompatibility } from './algorithm';

const STORAGE_KEY = 'found_app_state_v1';

export interface AppState {
  user: User | null;
  matches: Match[];
  messages: Record<string, Message[]>;
  commPrefs: Record<string, CommunicationPref>;
  purchases: Purchase[];
  insightsUnlocked: boolean;
  queueExpanded: boolean;
  verificationStep: 'phone' | 'photo' | 'complete';
  phoneAttempts: number;
  phoneLockoutUntil: number | null;
}

export const DEFAULT_STATE: AppState = {
  user: null,
  matches: [],
  messages: {},
  commPrefs: {},
  purchases: [],
  insightsUnlocked: false,
  queueExpanded: false,
  verificationStep: 'phone',
  phoneAttempts: 0,
  phoneLockoutUntil: null,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    
    // Parse dates
    if (parsed.user) {
      parsed.user.createdAt = new Date(parsed.user.createdAt);
      parsed.user.updatedAt = new Date(parsed.user.updatedAt);
    }
    parsed.matches = (parsed.matches || []).map((m: any) => ({
      ...m,
      surfacedAt: new Date(m.surfacedAt),
      aActionedAt: m.aActionedAt ? new Date(m.aActionedAt) : null,
      bActionedAt: m.bActionedAt ? new Date(m.bActionedAt) : null,
      suppressUntil: m.suppressUntil ? new Date(m.suppressUntil) : null,
      updatedAt: new Date(m.updatedAt),
    }));
    
    return parsed;
  } catch (e) {
    console.error("Failed to load state", e);
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Function to run the algorithm and seed matches after onboarding
export function generateMatchesForUser(user: User): Match[] {
  // Group user answers by dimension
  const userAnswersByDim: Record<string, number[]> = {
    SONIC: [],
    HABITAT: [],
    LOVE: [],
    VALUES: [],
    TIME: []
  };

  user.quizAnswers.forEach((ans) => {
    const quizMap = ['SONIC', 'HABITAT', 'LOVE', 'VALUES', 'TIME'];
    const dim = quizMap[ans.quizId - 1];
    if (dim) {
      userAnswersByDim[dim][ans.questionNum - 1] = ans.answer;
    }
  });

  const matches: Match[] = [];

  SEEDED_PROFILES.forEach((candidate) => {
    // Perform pairwise calculation
    const comp = calculateCompatibility(userAnswersByDim, candidate.quizAnswers);
    
    // Only surface matches with rawScore >= 40 (display score >= 60)
    if (comp.rawScore >= 40) {
      matches.push({
        id: `match-${user.id}-${candidate.id}`,
        userAId: user.id,
        userBId: candidate.id,
        compatibilityScore: comp.rawScore,
        displayScore: comp.displayScore,
        tags: comp.tags,
        surfacedAt: new Date(),
        aAction: null,
        bAction: null,
        aActionedAt: null,
        bActionedAt: null,
        status: MatchStatus.PENDING,
        suppressUntil: null,
        updatedAt: new Date(),
      });
    }
  });

  // Sort matches by compatibility score descending
  matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return matches;
}
