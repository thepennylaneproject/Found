/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gender } from '../types';

export interface SeededProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  location: string;
  bio: string;
  photos: { url: string; order: number }[];
  interestChips: string[];
  appearanceThisIsMe: string[];
  appearanceDrawnTo: string[];
  quizAnswers: Record<'SONIC' | 'HABITAT' | 'LOVE' | 'VALUES' | 'TIME', number[]>;
  initialChatGreeting: string;
}

export const SEEDED_PROFILES: SeededProfile[] = [
  {
    id: "candidate-chloe",
    name: "Chloe",
    age: 27,
    gender: Gender.WOMAN,
    location: "San Francisco, CA",
    bio: "I'm a graphic designer who operates on coffee, indie folk, and analog photography. Usually found wandering around museums or trying to keep my houseplants alive. I value slow Sunday mornings, honest conversations, and people who are building something they believe in.",
    photos: [
      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Analogue photography", "Indie folk", "Ceramics", "Modern art", "Espresso", "Hiking"],
    appearanceThisIsMe: ["Messy bun", "Linen shirts", "Warm eyes", "Vintage rings"],
    appearanceDrawnTo: ["Kind smile", "Passionate eyes", "Creative hands", "Grounded presence"],
    quizAnswers: {
      SONIC: [0, 1, 0, 0, 0], // Music first, quiet sing along, wants partner to share, sadness: feel it fully, excited by different taste
      HABITAT: [2, 2, 2, 1, 2], // Coffee shop, decompress at home, home is self, coffee shops/bookstores, couch deep in project
      LOVE: [0, 2, 0, 0, 0], // Show up, make quality time, say immediately (Conflict=0), go all in, resolve before sleep
      VALUES: [3, 1, 2, 0, 0], // Ask what is going on, roots matter, money is freedom, engage directly, match ambition
      TIME: [0, 0, 0, 0, 2] // Make something, slow morning, middle of making, specific niche thing, intentionally unhurried
    },
    initialChatGreeting: "Hey! I really loved reading about your sonic profile. It feels rare to find someone who also needs music to feel sad fully. What's the last song that made you feel that way?"
  },
  {
    id: "candidate-julian",
    name: "Julian",
    age: 29,
    gender: Gender.MAN,
    location: "Oakland, CA",
    bio: "Woodworker and bread baker. I spend my weekdays building custom furniture and my weekends hiking around Marin or getting lost in dusty record shops. I prefer deep listening to loud talking, and I'm looking for someone to build a steady, creative life with.",
    photos: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Woodworking", "Sourdough", "Vinyl records", "Camping", "Backpacking", "Jazz"],
    appearanceThisIsMe: ["Scruffy beard", "Flannel shirts", "Calloused hands", "Deep voice"],
    appearanceDrawnTo: ["Natural look", "Bright eyes", "Expressive smile", "Warm laugh"],
    quizAnswers: {
      SONIC: [3, 2, 2, 0, 0], // Quiet is point, feel it - no share, overlap some, sadness: feel fully, excited by different
      HABITAT: [3, 1, 2, 2, 2], // Puttering house, decompress outside, home is self, trails/parks/water, couch deep project
      LOVE: [2, 2, 1, 1, 1], // Give space, make time, wait until know (Conflict=1), move slowly, few hours cool down
      VALUES: [2, 1, 1, 1, 1], // Say won't & why, roots matter, money is security, say piece once, understand/make room
      TIME: [0, 2, 0, 1, 2] // Make something, parallel play, middle of making, specific niche thing, intentionally unhurried
    },
    initialChatGreeting: "Hi there! I noticed we both have 'slow sundays' and 'roots run deep' as our matching tags. How do you usually spend your perfect Sunday morning?"
  },
  {
    id: "candidate-maya",
    name: "Maya",
    age: 26,
    gender: Gender.WOMAN,
    location: "Berkeley, CA",
    bio: "PhD candidate in ecology. I study forest micro-climates and spend a lot of time in the dirt. When I'm not in the field, I write poetry, cook elaborate meals for my friends, and search for the perfect matcha latte. Let's talk about books, trees, or your favorite childhood memory.",
    photos: [
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Ecology", "Poetry", "Matcha", "Gardening", "Thrifting", "Cooking"],
    appearanceThisIsMe: ["Curly hair", "Wire-rimmed glasses", "Sun freckles", "Earth tones"],
    appearanceDrawnTo: ["Curious eyes", "Relaxed posture", "Authentic smile", "Gentle vibe"],
    quizAnswers: {
      SONIC: [0, 2, 2, 0, 0], // Music first, feel it no share, overlap some, sadness: feel fully, excited by different
      HABITAT: [1, 1, 2, 2, 2], // Up early out, decompress outside, home is self, trails/parks, couch deep project
      LOVE: [1, 2, 3, 1, 1], // Check in constantly, make time, write first (Conflict=3), move slowly, hours cool down
      VALUES: [3, 1, 3, 0, 1], // Ask what's going on, roots matter, money is complicated, engage directly, understand/make room
      TIME: [2, 1, 3, 2, 2] // Move, slow morning, outside moving, spend alone, intentionally unhurried
    },
    initialChatGreeting: "Hey! Your habitat responses matched mine almost perfectly. It's awesome to find someone else who needs to decompress outside. What's your absolute favorite trail in the Bay Area?"
  },
  {
    id: "candidate-marcus",
    name: "Marcus",
    age: 31,
    gender: Gender.MAN,
    location: "San Francisco, CA",
    bio: "Product engineer at a climate tech startup. I love fast-paced environments, running half-marathons, and discovering new music at intimate warehouse gigs. I keep a busy calendar but make absolute space for the people I care about. Looking for someone with drive, curiosity, and a sense of adventure.",
    photos: [
      { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Climate Tech", "Running", "Electronic music", "Live shows", "Travel", "Natural wine"],
    appearanceThisIsMe: ["Athletic build", "Clean cut", "Direct gaze", "Expressive brow"],
    appearanceDrawnTo: ["Sincere smile", "Ambitious aura", "Polished style", "Vibrant energy"],
    quizAnswers: {
      SONIC: [1, 0, 2, 1, 0], // Shuffles, grab whoever next, overlap some, sadness: pulls out, excited by different
      HABITAT: [1, 0, 1, 0, 1], // Up early out, somewhere loud, rarely home, late nights, out with people
      LOVE: [0, 1, 0, 0, 0], // Show up, does without asking, say immediately (Conflict=0), go all in, resolve before sleep
      VALUES: [0, 0, 2, 0, 0], // Do it (loyalty), go build anywhere, money is freedom, engage directly, match ambition
      TIME: [2, 3, 1, 1, 0] // Move, food/convo, laughing hard, physical free time, full pace
    },
    initialChatGreeting: "Hey there! Your profile says you're also a builder who values matching ambition. I'm working on some climate tech challenges right now. What's a project or idea that is taking up your brain space lately?"
  },
  {
    id: "candidate-clara",
    name: "Clara",
    age: 28,
    gender: Gender.WOMAN,
    location: "Sausalito, CA",
    bio: "Illustrator and paddleboard enthusiast. Living by the water has slowed me down in the best way. I spend my days sketching, paddleboarding, and searching for the best seafood shacks. I'm a quiet observer looking for a partner who is grounded, communicative, and appreciates parallel play.",
    photos: [
      { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Illustration", "Paddleboarding", "Ocean conservation", "Seafood", "Sketching", "Coffee"],
    appearanceThisIsMe: ["Freckles", "Saltwater hair", "Gentle eyes", "Casual style"],
    appearanceDrawnTo: ["Grounded eyes", "Steady hands", "Attentive listener", "Genuine smile"],
    quizAnswers: {
      SONIC: [3, 2, 1, 2, 2], // Quiet is point, feel it - no share, keep private, silence sad, fine as long as agree
      HABITAT: [3, 1, 2, 2, 2], // Puttering, decompress outside, home is self, trails/parks, couch deep show
      LOVE: [2, 3, 1, 1, 1], // Give space, remembers small, wait until know (Conflict=1), move slowly, cool down
      VALUES: [3, 1, 1, 2, 2], // Ask what's going on, roots matter, security, recalibrate view, balance ambition
      TIME: [0, 2, 2, 2, 2] // Make something, parallel play, alone/unbothered, alone free time, intentionally unhurried
    },
    initialChatGreeting: "Hello! It was so cool to see our compatibility score. It looks like we're both really into parallel play and intentionally unhurried paces of life. What does your ideal quiet day look like?"
  },
  {
    id: "candidate-liam",
    name: "Liam",
    age: 26,
    gender: Gender.MAN,
    location: "San Francisco, CA",
    bio: "Chef de partie at a contemporary restaurant. Food is my love language. When I'm not in the kitchen, I'm finding obscure cinema, cycling up Twin Peaks, or getting lost in deep house playlists. Looking for someone who is warm, a little bit spontaneous, and loves to eat.",
    photos: [
      { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=600&q=80", order: 1 },
      { url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&h=600&q=80", order: 2 }
    ],
    interestChips: ["Gastronomy", "House music", "Obscure cinema", "Cycling", "Street food", "Spontaneity"],
    appearanceThisIsMe: ["Broad shoulders", "Short dark hair", "Attentive expression", "Tattoos"],
    appearanceDrawnTo: ["Warm smile", "Bold style", "Expressive laugh", "Playful energy"],
    quizAnswers: {
      SONIC: [0, 0, 2, 1, 0], // Music first, grab next to, overlap some, sadness: pulls out, excited by different
      HABITAT: [0, 0, 0, 0, 1], // Bed at 10, decompress loud, chaos home, late nights, out with people
      LOVE: [0, 1, 0, 0, 2], // Show up, does without asking, say immediately (Conflict=0), go all in, physical reassurance
      VALUES: [3, 0, 2, 1, 1], // Ask what's going on, go build anywhere, money is freedom, say piece once, understand ambition
      TIME: [0, 3, 1, 0, 0] // Make something (cook!), good food/convo, laughing hard, specific niche, full pace
    },
    initialChatGreeting: "Hey! I saw we both have 'makers' as our tag. For me it's culinary arts, what kind of creating or making gets you excited?"
  }
];
