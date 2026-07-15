/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Key format: "quiz_questionIndex_aAnswer_bAnswer"
// Order of a/b doesn't matter — normalized by sorting in matching logic

export const TAG_LOOKUP: Record<string, string> = {
  // Sonic identity (quiz 1)
  'sonic_0_0_0': 'music first',           // both: feel everything
  'sonic_0_0_1': 'music all the time',    // feel everything + surprise me
  'sonic_3_0_0': 'music when it hurts',   // both: music to feel sad fully
  'sonic_4_0_0': 'open to everything',    // both: excited by different taste

  // Natural habitat (quiz 2)
  'habitat_0_0_0': 'slow mornings',       // both: still in bed at 10
  'habitat_1_2_2': 'home people',         // both: decompress at home
  'habitat_1_1_1': 'outdoors',            // both: decompress outside
  'habitat_1_0_0': 'social rechargers',   // both: need people's energy
  'habitat_4_2_2': 'couch night owls',    // both: couch at 8pm

  // How you love (quiz 3)
  'love_0_0_2': 'balanced care',          // show up + give space
  'love_1_0_0': 'words matter',           // both: say it out loud
  'love_1_2_2': 'quality time',           // both: make real time
  'love_4_0_0': 'closers',                // both: resolve before sleep

  // What you believe (quiz 4)
  'values_4_0_0': 'builders',             // both: want someone building too
  'values_4_1_1': 'make room',            // both: understand ambition
  'values_1_0_0': 'movers',               // both: go when opportunity calls
  'values_1_3_3': 'roots run deep',       // both: pass on uprooting

  // How you spend time (quiz 5)
  'time_0_0_0': 'makers',                 // both: make things
  'time_0_0_1': 'creative together',      // make + consume
  'time_0_2_2': 'movers',                 // both: move/exercise
  'time_1_0_0': 'slow sundays',           // both: slow morning together
  'time_1_2_2': 'parallel play',          // both: do own things nearby
  'time_4_0_0': 'full lives',             // both: full pace
  'time_4_2_2': 'intentional pace',       // both: protect their time
};

export function generateTags(
  aAnswers: Record<string, number[]>,
  bAnswers: Record<string, number[]>
): string[] {
  const found: string[] = [];
  const quizMap: Record<string, string> = {
    SONIC: 'sonic', HABITAT: 'habitat', LOVE: 'love', VALUES: 'values', TIME: 'time'
  };

  for (const [dim, prefix] of Object.entries(quizMap)) {
    const aQ = aAnswers[dim];
    const bQ = bAnswers[dim];
    if (!aQ || !bQ) continue;
    
    for (let i = 0; i < 5; i++) {
      const a = aQ[i];
      const b = bQ[i];
      if (a === undefined || b === undefined) continue;
      
      const key1 = `${prefix}_${i}_${Math.min(a, b)}_${Math.max(a, b)}`;
      const key2 = `${prefix}_${i}_${a}_${b}`;
      const tag = TAG_LOOKUP[key1] || TAG_LOOKUP[key2];
      if (tag && !found.includes(tag)) {
        found.push(tag);
      }
      if (found.length >= 3) break;
    }
    if (found.length >= 3) break;
  }

  // Fallback tags if not enough found
  if (found.length < 3) {
    const fallbacks = ['highly compatible', 'similar values', 'genuine connection', 'good energy', 'shared rhythm'];
    let idx = 0;
    while (found.length < 3 && idx < fallbacks.length) {
      if (!found.includes(fallbacks[idx])) {
        found.push(fallbacks[idx]);
      }
      idx++;
    }
  }

  return found.slice(0, 3);
}
