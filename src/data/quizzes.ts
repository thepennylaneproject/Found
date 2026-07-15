/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  num: number;
  text: string;
  options: string[];
}

export interface Quiz {
  id: number;
  dimension: 'SONIC' | 'HABITAT' | 'LOVE' | 'VALUES' | 'TIME';
  name: string;
  descriptor: string;
  reveals: string;
  questions: QuizQuestion[];
  reflections: Record<string, string>;
}

export const QUIZZES: Quiz[] = [
  {
    id: 1,
    dimension: 'SONIC',
    name: 'Sonic identity',
    descriptor: 'music + mood',
    reveals: 'music as social behavior, mood regulation, energy source',
    questions: [
      {
        num: 1,
        text: "It's friday night, you're alone in the car. what's playing?",
        options: [
          "something that makes me feel everything at once",
          "whatever shuffles — I like surprises",
          "a podcast or a long playlist I know by heart",
          "nothing. the quiet is the point"
        ]
      },
      {
        num: 2,
        text: "A song you love comes on at a bar. you...",
        options: [
          "grab whoever's next to you and make them listen",
          "quietly sing along and hope no one notices",
          "just feel it — no need to share it",
          "immediately text it to three people"
        ]
      },
      {
        num: 3,
        text: "Your music taste is something you...",
        options: [
          "want a partner to share completely",
          "keep mostly private — it's deeply personal",
          "are happy to overlap on some things, not everything",
          "never really thought about — it's just background"
        ]
      },
      {
        num: 4,
        text: "When you're sad, music is...",
        options: [
          "the thing that lets me feel it fully",
          "the thing that pulls me out of it",
          "something I turn off — I need silence",
          "still just on in the background, same as always"
        ]
      },
      {
        num: 5,
        text: "A new person you're interested in has completely different music taste. you feel...",
        options: [
          "genuinely excited — a whole world I haven't heard",
          "a little wary — music says a lot about a person",
          "fine with it as long as we agree on the important stuff",
          "unbothered — we don't have to like the same things"
        ]
      }
    ],
    reflections: {
      mostlyA: "you lead with feeling. music lives loudly in your life.",
      mostlyBC: "you hold your music close. it's personal, not performative.",
      mostlyD: "music is ambient for you. connection happens in other registers."
    }
  },
  {
    id: 2,
    dimension: 'HABITAT',
    name: 'Your natural habitat',
    descriptor: 'space + rhythm',
    reveals: 'lifestyle rhythm, energy source, daily cadence',
    questions: [
      {
        num: 1,
        text: "Perfect saturday morning, no obligations. you are...",
        options: [
          "still in bed at 10, coffee on the nightstand",
          "up early, already out the door somewhere",
          "at a coffee shop with something to read or make",
          "puttering around the house doing small satisfying things"
        ]
      },
      {
        num: 2,
        text: "You need to decompress after a hard week. you go...",
        options: [
          "somewhere loud and alive — I need other people's energy",
          "outside. nature, a walk, anywhere with fresh air",
          "home. my space, my things, my silence",
          "to one specific place that always feels like mine"
        ]
      },
      {
        num: 3,
        text: "Your home is...",
        options: [
          "always a little chaotic but full of things I love",
          "a place to sleep — I'm rarely here",
          "where I feel most like myself",
          "clean and calm — it has to be or I can't think"
        ]
      },
      {
        num: 4,
        text: "Your ideal city has a lot of...",
        options: [
          "late nights, live music, places that stay open",
          "coffee shops, bookstores, quiet corners",
          "trails, parks, water — somewhere to breathe",
          "culture, food, things that make you think"
        ]
      },
      {
        num: 5,
        text: "On a tuesday night at 8pm you are most likely...",
        options: [
          "already asleep or thinking about it",
          "out with people — weeknights count too",
          "on the couch deep in something — a show, a book, a project",
          "at the gym, a class, somewhere with a routine"
        ]
      }
    ],
    reflections: {
      nightOwl: "you come alive when the day winds down.",
      earlyActive: "you build your life around motion and light.",
      homeCentered: "your home is where you actually live, not just sleep."
    }
  },
  {
    id: 3,
    dimension: 'LOVE',
    name: 'How you love',
    descriptor: 'care + conflict',
    reveals: 'attachment style, care language, conflict approach',
    questions: [
      {
        num: 1,
        text: "Your partner has a genuinely hard week. you...",
        options: [
          "show up — physically, with food, with presence",
          "check in constantly so they know I'm thinking of them",
          "give them space and let them come to me when ready",
          "try to fix or solve whatever's wrong"
        ]
      },
      {
        num: 2,
        text: "You feel most valued when someone...",
        options: [
          "says it out loud — tell me, don't make me guess",
          "does something without being asked",
          "makes time — real, undistracted time",
          "remembers the small things I said in passing"
        ]
      },
      {
        num: 3,
        text: "When something's bothering you in a relationship, you...",
        options: [
          "say it immediately — unresolved things sit wrong with me",
          "wait until I know exactly what I want to say",
          "hope it surfaces naturally without a big conversation",
          "write it out first — I process better that way"
        ]
      },
      {
        num: 4,
        text: "Early in something new, you tend to...",
        options: [
          "go all in fast — if it's right, it's right",
          "move slowly and watch how they act over time",
          "match their energy — I follow their lead",
          "keep one foot back until I feel safe"
        ]
      },
      {
        num: 5,
        text: "After a fight, you need...",
        options: [
          "to resolve it before I can sleep — I can't leave it open",
          "a few hours alone to cool down, then I'm ready",
          "physical reassurance — touch, proximity, presence",
          "to hear that we're okay even before we've worked it out"
        ]
      }
    ],
    reflections: {
      fastResolver: "you love with urgency. you need to know things are okay.",
      spaceGiver: "you love quietly and steadily. you show up when it matters.",
      physicalPresent: "your love language is presence. you're there or you're not."
    }
  },
  {
    id: 4,
    dimension: 'VALUES',
    name: 'What you actually believe',
    descriptor: 'values + risk',
    reveals: 'core values, risk tolerance, ambition alignment',
    questions: [
      {
        num: 1,
        text: "A close friend asks you to cover for them in a way that makes you uncomfortable. you...",
        options: [
          "do it — loyalty is loyalty",
          "tell them you can't but don't explain why",
          "say you won't and tell them exactly why",
          "ask what's actually going on before deciding"
        ]
      },
      {
        num: 2,
        text: "You get a real opportunity — career, creative, life-changing — but it means uprooting everything. you...",
        options: [
          "go. you can build a life anywhere",
          "seriously consider it but roots matter to me",
          "only go if the people I love can come too",
          "pass — what I have here took years to build"
        ]
      },
      {
        num: 3,
        text: "When you think about money, you mostly feel...",
        options: [
          "it's a tool — I want enough to not think about it",
          "it's security — I work hard so I can stop worrying",
          "it's freedom — the more options I have the better",
          "complicated. I try not to let it drive decisions"
        ]
      },
      {
        num: 4,
        text: "You find out someone you respect holds a political view you strongly disagree with. you...",
        options: [
          "engage directly — I want to understand how they got there",
          "say my piece once, then let it go",
          "quietly recalibrate how much I trust their judgment",
          "it depends entirely on what the view is"
        ]
      },
      {
        num: 5,
        text: "Your ambition is something your partner should...",
        options: [
          "match — I want someone building something too",
          "understand and make room for, even if it's not theirs",
          "balance — someone who slows me down in the good way",
          "not worry about — work stays in its lane"
        ]
      }
    ],
    reflections: {
      builderMover: "you're in motion. you need someone who gets that.",
      rootsFirst: "you build deeply. your relationships are part of your foundation.",
      separateLanes: "you keep work and life in their own containers. intentionally."
    }
  },
  {
    id: 5,
    dimension: 'TIME',
    name: 'How you spend time',
    descriptor: 'hobbies + pace',
    reveals: 'hobbies, pace of life, shared activity compatibility',
    questions: [
      {
        num: 1,
        text: "Three free hours, zero obligations. you...",
        options: [
          "make something — cook, build, write, create",
          "consume something — a film, a book, a long playlist",
          "move — a run, a hike, anything that uses my body",
          "connect — call someone, meet up, be around people"
        ]
      },
      {
        num: 2,
        text: "The ideal sunday with someone you like looks like...",
        options: [
          "slow morning, nowhere to be, just being in the same space",
          "an adventure — somewhere neither of us has been",
          "doing our own things nearby — parallel play",
          "good food, good conversation, something to look forward to"
        ]
      },
      {
        num: 3,
        text: "You are most yourself when you are...",
        options: [
          "in the middle of making something",
          "laughing hard with people I trust",
          "alone and completely unbothered",
          "outside, moving, feeling small in a good way"
        ]
      },
      {
        num: 4,
        text: "A hobby you've never mentioned on a first date but probably should...",
        options: [
          "how much I know about one very specific niche thing",
          "how physical my free time actually is",
          "how much time I spend completely alone and like it",
          "how social I actually am when no one's watching"
        ]
      },
      {
        num: 5,
        text: "Your pace of life right now is...",
        options: [
          "full. I like it that way — stillness makes me restless",
          "slower than I'd like. I'm working back toward myself",
          "intentionally unhurried. I protect my time hard",
          "chaotic in a way I haven't figured out yet"
        ]
      }
    ],
    reflections: {
      makerCreator: "you express through making. you need someone who respects that time.",
      moverActive: "your body is how you process the world. you need space to move.",
      soloRich: "you're deeply comfortable alone. that's not a flaw — it's a feature."
    }
  }
];
