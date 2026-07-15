# INTELLIGENCE PROFILE — found

**Audit type:** Intelligence extraction (report-only)  
**Prompt:** `audits/prompts/intelligence_extraction_prompt.md`  
**Generated:** Tuesday, July 7, 2026

---

## SECTION 1: PROJECT IDENTITY

| Field | Value |
|-------|-------|
| **Project name** | `found` (from `audits/project.toml`, `metadata.json`); package.json lists `react-example` (mismatch — boilerplate name) |
| **Repository URL** | **Not found** — no `.git` directory; no remote configured |
| **One-line description (verbatim)** | From `metadata.json`: *"Stop looking. Start being found. A curated, quiz-first dating platform built for user success."* |
| **Cleaner description** | A client-side dating app prototype that uses scenario-based quizzes to compute compatibility scores, surfaces curated daily matches, and simulates privacy-first messaging and verification flows. |
| **Project status** | **Prototype** — core UX flows are implemented end-to-end in the browser with seeded data and simulated backends; no real server, database, auth, or payments. |
| **First commit date** | **Not found** — not a git repository |
| **Most recent commit date** | **Not found** — not a git repository |
| **Total commits** | **0** — not a git repository |
| **Deployment status** | **Not deployed from this repo.** No `vercel.json`, `netlify.toml`, Dockerfile, or CI/CD configs. README references Google AI Studio hosting. |
| **Live URL(s)** | AI Studio app link in README: `https://ai.studio/apps/ddebac42-3664-4e0c-8d6c-7a1e83b51acf` (external; not verified reachable from audit) |

---

## SECTION 2: TECHNICAL ARCHITECTURE

### Primary language(s) and frameworks

| Layer | Technology | Version (from package.json) |
|-------|------------|----------------------------|
| Language | TypeScript | ~5.8.2 |
| UI framework | React | ^19.0.1 |
| Build tool | Vite | ^6.2.3 |
| Styling | Tailwind CSS (v4 via `@tailwindcss/vite`) | ^4.1.14 |
| Animation | motion | ^12.23.24 |
| Icons | lucide-react | ^0.546.0 |
| AI SDK (declared, unused in app code) | @google/genai | ^2.4.0 |
| Server framework (declared, unused) | express | ^4.21.2 |

### Full dependency list

#### Core framework dependencies
- `react`, `react-dom` — UI rendering
- `vite`, `@vitejs/plugin-react` — dev server and bundling
- `typescript` — type checking (also used as "lint" script)

#### UI/styling libraries
- `tailwindcss`, `@tailwindcss/vite`, `autoprefixer`
- `lucide-react` — icon set
- `motion` — animations (imported in package.json; **not referenced in `src/`**)

#### State management
- **None** — React `useState` + `useEffect` in `App.tsx`; persisted via `localStorage` in `src/utils/localDb.ts`

#### API/data layer
- **None** — no HTTP client, ORM, or backend. All data is in-memory + `localStorage`.

#### AI/ML integrations
- `@google/genai` listed in dependencies; `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
- **No AI calls in application source** — compatibility is deterministic algorithm in `src/utils/algorithm.ts`

#### Authentication/authorization
- **None** — simulated phone/photo verification UI only

#### Testing
- **None** — no test runner, no test files

#### Build tooling
- `vite`, `esbuild`, `tsx`, `@types/node`, `@types/express`

#### Other notable dependencies
- `dotenv` — listed; not used in `src/`
- `audits/` subtree contains a full LYRA audit kit (lyra.ts, session.py, etc.) — separate from the dating app

### Project structure (2 levels)

```
found/
├── src/                    # React application source
│   ├── components/         # Screen-level UI components (8 files)
│   ├── data/               # Static quiz content, seeded profiles, tag lookup
│   ├── utils/              # localStorage persistence + compatibility algorithm
│   ├── App.tsx             # Root state machine and routing
│   ├── main.tsx            # React entry
│   ├── types.ts            # Domain type definitions
│   └── index.css           # Tailwind theme + brand tokens
├── assets/                 # AI Studio asset folder (minimal)
├── audits/                 # LYRA audit infrastructure (prompts, lyra.ts, session.py)
├── index.html              # SPA shell
├── vite.config.ts          # Vite + Tailwind config
├── package.json
├── metadata.json           # AI Studio app metadata
├── tsconfig.json
├── .env.example
└── README.md
```

### Architecture pattern

**JAMstack-style client-only SPA (sandbox/demo).**

```
User → React UI (components)
         ↓ read/write
       App.tsx state
         ↓ persist
       localStorage (found_app_state_v1)
         ↓ on quiz complete
       algorithm.ts → calculateCompatibility()
         ↓ match against
       SEEDED_PROFILES (static TS data)
```

No server round-trips. External services (Twilio, Stripe, AWS Rekognition) are **simulated in UI** with mock consoles and timeouts.

### Database/storage layer

**No database.** Persistence model:

| Store | Key/location | Schema (inferred from types) |
|-------|--------------|------------------------------|
| localStorage | `found_app_state_v1` | `AppState` interface in `localDb.ts` |

**Logical entities** (TypeScript interfaces in `types.ts`, not persisted to a DB):

| Entity | Key fields |
|--------|------------|
| `User` | id, name, age, gender, phoneNumber, phoneVerified, photoVerified, location, locationRadius, ageRangeMin/Max, photos[], quizAnswers[], dimensionScores[], interestChips[], appearanceChips[] |
| `Match` | id, userAId, userBId, compatibilityScore, displayScore, tags[], status, aAction/bAction, surfacedAt |
| `Message` | id, matchId, senderId, content, type (TEXT/PHOTO), readAt, createdAt |
| `CommunicationPref` | matchId, userId, voiceEnabled, videoEnabled, smsEnabled |
| `Purchase` | id, userId, type (QUEUE_BOOST/INSIGHTS/SUCCESS_DONATION), stripePaymentId, amount, status |
| `QuizAnswer` | quizId (1–5), questionNum (1–5), answer (0–3) |
| `Photo` | url, publicId, order |

**Seeded data:** 6 candidate profiles in `src/data/profiles.ts`; 5 quizzes × 5 questions in `src/data/quizzes.ts`.

### API layer

**No API endpoints or serverless functions in the application.**

| Route/path | Method | Purpose | Auth |
|------------|--------|---------|------|
| — | — | No server routes exist | — |

All "API" behavior is mocked client-side (SMS codes, Stripe checkout, Twilio proxy, AWS face match).

### External service integrations

| Service | Referenced in UI/copy | Actually integrated? | Purpose (as designed) |
|---------|----------------------|---------------------|-------------------------|
| Twilio Verify | `VerificationScreen.tsx` | **No** — simulated 6-digit code | Phone verification |
| AWS Rekognition | `VerificationScreen.tsx` | **No** — simulate Face Match/Mismatch buttons | Photo/biometric verification |
| Twilio Proxy (voice/SMS) | `ChatView.tsx`, `App.tsx` | **No** — UI toggles + mock proxy number | Masked voice/SMS |
| Twilio Video | `ChatView.tsx` | **No** — local `getUserMedia` only | In-app video calls |
| Stripe | `MatchQueue.tsx`, `InsightsView.tsx` | **No** — fake checkout forms | Queue boost ($4.99), Insights ($9.99), donations |
| Google Gemini API | `metadata.json`, `.env.example`, `package.json` | **No usage in `src/`** | Declared for AI Studio hosting capability |
| Unsplash / Picsum | Image URLs in components | **Yes** — hotlinked images | Placeholder avatars and photos |

### AI/ML components

- **Models/providers:** `@google/genai` declared; no runtime usage in app code.
- **Prompts/chains:** None in application code. Quiz content is static strings in `src/data/quizzes.ts`.
- **Processing:** Compatibility scoring is a **deterministic weighted algorithm** (`DIMENSION_WEIGHTS`, complementarity rules, dealbreaker logic) — not LLM-based.
- **Tag generation:** Rule-based lookup table in `src/data/tags.ts` (`TAG_LOOKUP` + `generateTags()`).

### Authentication and authorization model

- **No real auth.** Flow: registration form → simulated SMS PIN (3 attempts, 30s lockout in sandbox) → simulated photo verification (3 attempts → manual review bypass).
- **Permission levels:** None. Single local user session.

### Environment variables (names only)

From `.env.example` and `vite.config.ts`:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Gemini AI API (AI Studio secrets) |
| `APP_URL` | Hosted applet URL (OAuth callbacks, self-referential links) |
| `DISABLE_HMR` | Disables Vite HMR/file watching (AI Studio agent edits) |

**Note:** Application `src/` does not read these variables. They are infrastructure/template for AI Studio deployment.

---

## SECTION 3: FEATURE INVENTORY

| Feature | User-facing description | Completeness | Key files | Dependencies |
|---------|------------------------|--------------|-----------|--------------|
| Welcome / brand landing | Marketing screen with product pillars and CTA | **Polished** | `WelcomeScreen.tsx` | — |
| Profile registration | Name, age, gender, location, phone, photos (presets or upload) | **Functional** | `RegistrationForm.tsx`, `types.ts` | — |
| Phone verification | Enter 6-digit SMS code with lockout | **Functional** (simulated) | `VerificationScreen.tsx` | Registration |
| Photo verification | Biometric match simulation | **Functional** (simulated) | `VerificationScreen.tsx` | Phone verification |
| Quiz onboarding | 5 dimensions × 5 scenario questions with reflections | **Polished** | `QuizOnboarding.tsx`, `data/quizzes.ts` | Verification |
| Compatibility algorithm | Weighted multi-dimensional scoring + tags | **Functional** | `utils/algorithm.ts`, `data/tags.ts` | Quiz answers |
| Match queue | 3 daily curated cards (expandable to 10) with like/pass | **Functional** | `MatchQueue.tsx`, `localDb.ts` | Algorithm, seeded profiles |
| Discover pool | Search/filter grid of pending matches | **Functional** | `DiscoverGrid.tsx` | Matches generated |
| Mutual match flow | Instant mutual like in sandbox; match modal | **Functional** (sandbox shortcut) | `App.tsx` | Match queue/discover |
| Text chat | In-app messaging with canned partner replies | **Partial** | `ChatView.tsx` | Active match |
| Photo messages | Send preset Unsplash images in chat | **Partial** | `ChatView.tsx` | Active match |
| Voice/video/SMS prefs | Mutual opt-in toggles with simulation console | **Partial** (UI only) | `ChatView.tsx` | Active match |
| Call overlays | Voice timer + video with local webcam | **Partial** (simulated) | `ChatView.tsx` | Mutual comm prefs |
| Insights / behavioral map | Locked personality breakdown; paywall | **Partial** | `InsightsView.tsx` | Quiz complete |
| Queue boost purchase | $4.99 Stripe modal to expand queue 3→10 | **Scaffolded** | `MatchQueue.tsx` | Queue exhausted |
| Insights unlock purchase | $9.99 one-time unlock | **Scaffolded** | `InsightsView.tsx` | Insights tab |
| Success donation | Voluntary donation on relationship success | **Scaffolded** | `InsightsView.tsx` | — |
| Sandbox reset | Clear localStorage and restart | **Functional** | `App.tsx`, `localDb.ts` | — |
| State persistence | Auto-save to localStorage | **Functional** | `localDb.ts` | All features |

---

## SECTION 4: DESIGN SYSTEM & BRAND

### Color palette

Defined in `src/index.css` `@theme`:

| Name | Hex | Defined in |
|------|-----|------------|
| brand-beige | `#FDF8F4` | `index.css` |
| brand-clay | `#A08070` | `index.css` |
| brand-terracotta | `#C07A50` | `index.css` |
| brand-charcoal | `#2C1A0E` | `index.css` |
| brand-stone | `#4A3728` | `index.css` |
| brand-cream | `#FFFFFF` | `index.css` |

Additional hardcoded palette overrides in `index.css` (e.g. `#FAF7F2` → `#FFF3EB`, `#E5DED4` → `#E8DDD4`).

Accent colors used inline: emerald (success), blue (video), purple (SMS), red (errors), amber (warnings).

### Typography

| Role | Font | Source |
|------|------|--------|
| Sans / body | Inter (300–700) | Google Fonts |
| Display / headlines | Playfair Display (400–700, italic) | Google Fonts |
| Mono / labels | JetBrains Mono (400–500) | Google Fonts |

Type scale: hero `text-6xl`/`text-8xl`, section headings `text-2xl`–`text-4xl`, body `text-sm`/`text-base`, micro-labels `text-[9px]`–`text-xs` with `uppercase tracking-widest font-mono`.

### Component library

No shared component library folder. Reusable patterns are inline per screen:

| Component | Description |
|-----------|-------------|
| `WelcomeScreen` | Landing hero + three pillar cards |
| `RegistrationForm` | Multi-step profile form |
| `VerificationScreen` | Phone + photo verification wizard |
| `QuizOnboarding` | Quiz flow with progress bar and reflection cards |
| `MatchQueue` | Single-card queue with compatibility breakdown |
| `DiscoverGrid` | Filterable grid + profile modal |
| `ChatView` | Split-pane messenger with comm controls |
| `InsightsView` | Paywalled insights + donation card |

### Design language

**Editorial minimal / warm earth-tone.** Serif display headlines, mono uppercase micro-labels, rounded-3xl cards, soft borders (`#E5DED4`), anti-swipe deliberate CTAs ("Connect" / "Pass Mindfully"). Positioned as mindful, anti-dopamine-loop dating.

### Responsive strategy

Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`): single-column mobile, grid layouts at `md+`, stacked forms on mobile. Chat uses `grid-cols-1 md:grid-cols-3`.

### Dark mode

**Not supported.** Single light/warm palette only.

### Brand assets

- Text logotype: `found.` (charcoal + terracotta dot) in `App.tsx` header
- No logo image files in repo
- Placeholder photos from Unsplash/Picsum (external URLs)
- AI Studio banner image referenced in README (external Google CDN)

---

## SECTION 5: DATA & SCALE SIGNALS

### User model

**Stored per user (localStorage):** profile fields, quiz answers, photos (URLs/blob URLs), verification flags, preferences. No server-side user record.

**User journey:** Welcome → Register → Verify phone → Verify photo → 25-question quiz → Algorithm generates matches from 6 seeded candidates → Queue/Discover → Like (instant mutual in sandbox) → Chat → Optional insights/donations.

### Content/data volume

- 6 seeded candidate profiles
- 5 quiz dimensions × 5 questions = 25 questions total
- ~40 tag lookup rules in `TAG_LOOKUP`
- Designed for **demo/sandbox scale**, not production user volume

### Performance considerations

- No pagination (max ~6 matches from seeds)
- No code splitting or lazy loading of routes
- No caching layer beyond localStorage
- No rate limiting
- Images loaded from external CDNs (Unsplash)

### Analytics/tracking

**None found** — no Google Analytics, PostHog, Segment, or similar.

### Error handling

- `localDb.ts`: try/catch on localStorage read/write with console.error + fallback to `DEFAULT_STATE`
- Form validation with inline error messages in registration
- No global error boundary, no Sentry, no structured logging

### Testing

**No test files found.** `package.json` has no `test` script (project.toml references `npm run test` but script does not exist).

---

## SECTION 6: MONETIZATION & BUSINESS LOGIC

### Pricing/tier structure

| Product | Price | Location | Enforced? |
|---------|-------|----------|-----------|
| Daily queue (default) | Free, 3 matches | `MatchQueue.tsx` (`queueLimit = 3`) | **Yes** (client-side slice) |
| Queue boost | $4.99 one-time → 10 matches | `MatchQueue.tsx` | **UI only** — sets `queueExpanded: true` on fake payment |
| Compatibility insights | $9.99 one-time | `InsightsView.tsx` | **UI only** — sets `insightsUnlocked: true` |
| Success donation | $10 / $25 / $50 / $100 presets, custom min $5 | `InsightsView.tsx` | **UI only** — success message, no charge |

Merchant displayed: **"The Penny Lane Project"** in Stripe modals.

### Payment integration

**Stripe referenced in UI only.** No Stripe SDK, no API keys, no webhook handlers. Card forms accept any input and auto-succeed after timeout.

### Subscription/billing logic

**None.** All monetization is positioned as one-time purchases or voluntary donations. Copy explicitly states "No recurring bills."

### Feature gates

| Gate | Rule |
|------|------|
| Insights content | Hidden until `insightsUnlocked === true` (pay $9.99 in UI) |
| Queue expansion | Locked until user completes 3 queue cards AND pays $4.99 (or already expanded) |
| Voice/video/SMS | Requires mutual opt-in from both parties |
| Match surfacing | `rawScore >= 40` required (`localDb.ts`) |
| Registration | Age >= 18,至少 1 photo, phone required |

### Usage limits — SPECIFIC RULES (from code)

| Rule | Value | Evidence |
|------|-------|----------|
| Default daily queue size | **3 matches** | `MatchQueue.tsx`: `queueLimit = queueExpanded ? 10 : 3` |
| Expanded queue size | **10 matches** | Same |
| Queue boost price | **$4.99** (499 cents implied in types but UI shows dollars) | `MatchQueue.tsx` |
| Insights unlock price | **$9.99** | `InsightsView.tsx` |
| Donation presets | **$10, $25, $50, $100**; custom min **$5** | `InsightsView.tsx` |
| SMS verification attempts | **3** before lockout | `VerificationScreen.tsx` |
| SMS lockout duration (sandbox) | **30 seconds** (comment says "instead of 24 hrs") | `VerificationScreen.tsx` |
| Photo verification attempts | **3** before manual review | `VerificationScreen.tsx` |
| Match surfacing threshold | **rawScore >= 40** (display >= ~60) | `localDb.ts` line 103 |
| Compatibility dimension weights | LOVE **0.30**, VALUES **0.25**, HABITAT **0.20**, SONIC **0.15**, TIME **0.10** | `algorithm.ts` |
| Dealbreaker penalty | **-30** points on weighted score | `algorithm.ts` |
| Values floor | If VALUES dimension < **0.40**, cap weighted score at **45** | `algorithm.ts` |
| Display score mapping | raw [50,100] → display [70,99]; below 50 → 65–69 | `algorithm.ts` |
| Max photos | **4** | `RegistrationForm.tsx` |
| Location radius | **5–100 miles**, step 5, default **25** | `RegistrationForm.tsx` |
| Age range | min **18**, max **99**, default **18–45** | `RegistrationForm.tsx` |
| Tags per match | **3** (with fallbacks) | `tags.ts` |
| Sandbox mutual match | User LIKE **always** triggers partner LIKE → instant ACTIVE | `App.tsx` `handleMatchAction` |

**UNDOCUMENTED CONSTRAINT:** Production SMS lockout is described as 24 hours in copy but implemented as 30 seconds in sandbox — production value unclear, needs owner input.

**UNDOCUMENTED CONSTRAINT:** "3 curated matches **daily**" and "Come back tomorrow at 6:00 AM" are stated in UI but **no daily refresh logic exists** in code — needs owner input.

---

## SECTION 7: CODE QUALITY & MATURITY SIGNALS

### Code organization

Clear separation: `components/` (UI), `data/` (static content), `utils/` (algorithm + persistence), `types.ts` (domain). Single `App.tsx` orchestrates all state — appropriate for prototype but will not scale.

### Patterns and conventions

- Functional React components with hooks
- Enum-heavy domain modeling in `types.ts`
- Deterministic compatibility engine with explicit business rules
- Consistent Apache-2.0 license headers
- Naming: PascalCase components, camelCase functions, SCREAMING enums

### Documentation

- README is AI Studio boilerplate (minimal, not product-specific)
- No architecture docs for the dating app
- Inline comments explain sandbox behaviors and algorithm rules
- `audits/` has extensive LYRA documentation (separate system)

### TypeScript usage

- `tsc --noEmit` as lint; no `strict` flag enabled in tsconfig
- Some `any` usage: `handleQuizComplete(quizAnswers: any[])`, `setActiveTab(tab.id as any)`
- Interfaces well-defined for domain entities
- `noEmit: true`, `skipLibCheck: true`

### Error handling patterns

Ad-hoc try/catch in persistence; form-level validation; no custom error classes; no user-facing global error UI.

### Git hygiene

**Not applicable** — no git repository initialized.

### Technical debt flags

- `package.json` name `react-example` vs product name `found`
- `express`, `@google/genai`, `motion`, `dotenv` in dependencies but unused in `src/`
- `index.html` title still "My Google AI Studio App"
- Compatibility breakdown bars in `MatchQueue.tsx` use `Math.random()` instead of real dimension scores
- `QuizOnboarding.tsx` reflection logic references `count[4]` on 0–3 answer scale (dead branch)
- `purchases` array in `AppState` is never populated
- `User.interestChips`, `appearanceChips`, `dimensionScores` defined in types but not populated in onboarding
- No TODO/FIXME markers in `src/` (clean but indicates early stage rather than tracked debt)

### Security posture

| Area | Status |
|------|--------|
| Input validation | Basic client-side only (age, required fields) |
| SQL injection | N/A — no database |
| XSS | React default escaping; user messages rendered as text |
| CORS | N/A — no API |
| Secrets | `.env.example` only; no secrets in repo |
| Auth | None — all data local |
| Phone numbers | Collected but never sent anywhere |
| Payment cards | Collected in fake forms (should never ship as-is) |

---

## SECTION 8: ECOSYSTEM CONNECTIONS

### Shared code with Penny Lane portfolio

| Sister project | Connection found? |
|----------------|-------------------|
| Relevnt | **No** |
| Codra | **No** |
| Ready | **No** |
| Mythos | **No** |
| embr | **No** |
| passagr | **No** |
| advocera | **No** |

**Portfolio link:** Stripe checkout modals display merchant **"The Penny Lane Project"** (`MatchQueue.tsx`). No other cross-project imports or shared libraries.

### Shared infrastructure

- **LYRA audit kit** vendored in `audits/` (shared audit tooling, not product runtime)
- No Supabase, Netlify, or shared component library detected in app code

### Data connections

**None** — fully isolated client-side sandbox.

---

## SECTION 9: WHAT'S MISSING (CRITICAL)

### Gaps for production-ready product

1. **Backend API** — user accounts, match storage, messaging, real-time delivery
2. **Real authentication** — Twilio Verify or equivalent; session/JWT management
3. **Database** — PostgreSQL/Supabase with proper schema and migrations for users, matches, messages
4. **Real matching pipeline** — daily batch job, geo filtering (lat/long collected but unused), gender/age filters on candidates
5. **Payment processing** — Stripe server-side with webhooks; never collect card data in React forms
6. **Photo storage** — S3/Cloudinary with presigned uploads (currently blob URLs and hotlinks)
7. **Biometric verification** — AWS Rekognition or similar server-side
8. **Twilio integration** — proxy voice/SMS/video for comm prefs
9. **Daily queue refresh** — cron/scheduler for 6 AM match delivery
10. **Moderation & safety** — block/report, content filtering, admin review queue
11. **Multi-user** — currently single local user vs seeded bots

### Gaps for investor readiness

1. No git history or deployment pipeline
2. No analytics, conversion, or retention metrics
3. No error monitoring (Sentry, etc.)
4. No uptime/SLA infrastructure
5. No privacy policy, terms, or data retention documentation
6. No test coverage or quality gates
7. Package name/README still reflect AI Studio boilerplate
8. Business model implemented only as UI simulation

### Gaps in the codebase

- Unused dependencies (`express`, `@google/genai`, `motion`, `dotenv`)
- `purchases` state never written
- Location coordinates always `null` — radius slider has no effect
- No server despite `metadata.json` declaring server-side Gemini capability
- `audits/project.toml` references `npm run test` and `npm run typecheck` scripts that don't exist in package.json

### Recommended next steps (top 5)

1. **Initialize git + rename package identity** — align `package.json`, `index.html`, README with `found` brand; establish version control.
2. **Add Supabase (or equivalent) backend** — users, matches, messages tables; replace localStorage for persistence.
3. **Implement real auth + verification** — Twilio Verify for phone; secure photo upload + Rekognition on server.
4. **Wire Stripe server-side** — Checkout Sessions for queue boost/insights; remove client-side card forms.
5. **Port algorithm to server + build candidate pool** — daily batch matching with real users; implement stated 6 AM refresh and 3-match limit with server enforcement.

---

## MATURITY CLASSIFICATION

**ALPHA**

Core onboarding, quiz, matching, chat, and monetization UI work end-to-end in a **local sandbox** with seeded data. Significant gaps: no backend, no real users, no payments, no daily refresh, simulated third-party services.

### INVESTOR READINESS

| Item | Status |
|------|--------|
| Core flow works end-to-end | **PRESENT** (sandbox/demo only) |
| No P0 security vulnerabilities | **MISSING** (fake payment forms, no auth, local-only) |
| Error monitoring configured | **MISSING** |
| Conversion/retention metrics available | **MISSING** |
| Uptime monitoring in place | **MISSING** |
| Technical debt quantified and tracked | **MISSING** |

---

## SECTION 10: CONSTRAINT CATALOG

### Architecture Constraints

```
CONSTRAINT: All application state for the dating demo must persist under localStorage key found_app_state_v1
DOMAIN: Architecture
SEVERITY: CRITICAL
EVIDENCE: src/utils/localDb.ts — STORAGE_KEY = 'found_app_state_v1'
VERIFY BY: grep found_app_state_v1 src/
VIOLATION: State fragmentation or loss on refresh — CRITICAL
```

```
CONSTRAINT: Match compatibility must be computed via calculateCompatibility() — not ad-hoc scoring in UI
DOMAIN: Architecture
SEVERITY: CRITICAL
EVIDENCE: src/utils/algorithm.ts, src/utils/localDb.ts generateMatchesForUser()
VERIFY BY: grep calculateCompatibility src/
VIOLATION: Inconsistent scores between queue and discover — CRITICAL
```

```
CONSTRAINT: Candidate profiles must come from SEEDED_PROFILES static data until a real user pool exists
DOMAIN: Architecture
SEVERITY: WARNING
EVIDENCE: src/data/profiles.ts, src/utils/localDb.ts
VERIFY BY: grep SEEDED_PROFILES src/
VIOLATION: Empty match pool — WARNING
```

```
CONSTRAINT: Vite HMR must respect DISABLE_HMR env var (AI Studio agent edit mode)
DOMAIN: Architecture
SEVERITY: SUGGESTION
EVIDENCE: vite.config.ts
VERIFY BY: inspect server.hmr and server.watch config
VIOLATION: UI flicker during automated edits — SUGGESTION
```

### Database & Data Layer Constraints

**No constraints found — needs owner input** (no database, ORM, or migrations in application code).

```
CONSTRAINT: AppState JSON shape must remain backward-compatible or migrate explicitly
DOMAIN: Database
SEVERITY: WARNING
EVIDENCE: src/utils/localDb.ts loadState/saveState
VERIFY BY: schema review of AppState interface vs persisted JSON
VIOLATION: Corrupt localStorage → silent reset to DEFAULT_STATE — WARNING
```

### Security & Authentication Constraints

```
CONSTRAINT: No API keys or secrets in client-side application code
DOMAIN: Security
SEVERITY: CRITICAL
EVIDENCE: src/ contains no hardcoded secrets; .env.example only
VERIFY BY: grep -rE '(sk_live|sk_test|api_key\s*=)' src/
VIOLATION: Exposed credential — CRITICAL
```

```
CONSTRAINT: Payment card data must not be collected in client forms in production
DOMAIN: Security
SEVERITY: CRITICAL
EVIDENCE: MatchQueue.tsx, InsightsView.tsx — inline card number/CVC inputs (sandbox only)
VERIFY BY: code review of payment UI
VIOLATION: PCI scope / fraud risk — CRITICAL (if shipped as-is)
```

```
CONSTRAINT: Phone verification lockout after failed attempts
DOMAIN: Security
SEVERITY: WARNING
EVIDENCE: VerificationScreen.tsx — 3 attempts
VERIFY BY: grep attempts >= 3 src/components/VerificationScreen.tsx
VIOLATION: UNDOCUMENTED CONSTRAINT — production lockout duration unclear (30s sandbox vs 24h copy)
```

### Business Logic Constraints

```
CONSTRAINT: Only matches with rawScore >= 40 may be added to the user's match list
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: src/utils/localDb.ts line 103
VERIFY BY: unit test or grep rawScore >= 40
VIOLATION: Low-quality matches surfaced — CRITICAL
```

```
CONSTRAINT: Dimension weights must sum to 1.0 — LOVE 0.30, VALUES 0.25, HABITAT 0.20, SONIC 0.15, TIME 0.10
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: src/utils/algorithm.ts DIMENSION_WEIGHTS
VERIFY BY: sum Object.values(DIMENSION_WEIGHTS)
VIOLATION: Skewed compatibility scores — CRITICAL
```

```
CONSTRAINT: LOVE conflict dealbreaker (immediate vs wait/hope) must apply -30 penalty to weighted score
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: src/utils/algorithm.ts lines 76-85
VERIFY BY: test case aConflict=0, bConflict=1
VIOLATION: Dealbreaker pairs ranked too high — CRITICAL
```

```
CONSTRAINT: VALUES dimension score below 0.40 must floor total weighted score at 45
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: src/utils/algorithm.ts lines 87-91
VERIFY BY: test breakdown['VALUES'] < 0.40
VIOLATION: Values-incompatible pairs over-ranked — CRITICAL
```

```
CONSTRAINT: Default match queue must show at most 3 pending matches unless queueExpanded is true (then 10)
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: src/components/MatchQueue.tsx queueLimit
VERIFY BY: grep queueExpanded src/
VIOLATION: Unlimited browsing contradicts product thesis — CRITICAL
```

```
CONSTRAINT: Insights behavioral map must remain locked until insightsUnlocked is true
DOMAIN: Business Logic
SEVERITY: WARNING
EVIDENCE: src/components/InsightsView.tsx overlay conditional
VERIFY BY: grep insightsUnlocked src/
VIOLATION: Revenue gate bypass — WARNING
```

```
CONSTRAINT: Voice, video, and SMS channels require mutual opt-in from both parties before activation UI
DOMAIN: Business Logic
SEVERITY: WARNING
EVIDENCE: src/components/ChatView.tsx isVoiceMutual, isVideoMutual, isSmsMutual
VERIFY BY: code review of mutual checks
VIOLATION: Privacy protocol bypass — WARNING
```

```
CONSTRAINT: Sandbox LIKE action must auto-set partner LIKE and status ACTIVE (demo behavior)
DOMAIN: Business Logic
SEVERITY: SUGGESTION
EVIDENCE: src/App.tsx handleMatchAction
VERIFY BY: grep bAction = MatchAction.LIKE src/App.tsx
VIOLATION: N/A in production — must be replaced with async mutual-match logic — CRITICAL when leaving sandbox
```

```
CONSTRAINT: Daily match refresh at 6:00 AM
DOMAIN: Business Logic
SEVERITY: CRITICAL
EVIDENCE: UI copy in MatchQueue.tsx only — no scheduler code
VERIFY BY: Owner must define and document this value
VIOLATION: Cannot audit until constraint value is defined — flag as UNDOCUMENTED CONSTRAINT
```

### Operational Policy Constraints

**No constraints found — needs owner input** (no CI/CD, no test coverage gates, no monitoring requirements in app repo).

```
CONSTRAINT: TypeScript compilation must pass (npm run lint → tsc --noEmit)
DOMAIN: Operations
SEVERITY: SUGGESTION
EVIDENCE: package.json scripts.lint
VERIFY BY: npm run lint
VIOLATION: Type errors ship — SUGGESTION
```

---

## SECTION 11: EXECUTIVE SUMMARY

**Paragraph 1 — What this is:**  
*found* is a quiz-first dating platform prototype built for The Penny Lane Project portfolio. It targets people tired of swipe-based apps and proposes a slower, curated model: users complete scenario-based questionnaires across five behavioral dimensions (sonic identity, habitat, love style, values, time use), receive a small daily set of high-compatibility matches, and communicate through privacy-first channels. The product narrative emphasizes anti-engagement-bait ethics—no infinite scroll, no subscription traps, and optional one-time purchases aligned with user success rather than retention.

**Paragraph 2 — Technical credibility:**  
The codebase is a well-crafted React 19 + Vite + Tailwind v4 SPA with a thoughtful domain model (`types.ts`), a documented compatibility algorithm with explicit weights and dealbreaker rules, rich static quiz content, and polished UI across eight screen components. The builder demonstrates product thinking (mutual opt-in comms, queue limits, paywall copy) and frontend engineering discipline (typed enums, localStorage persistence, responsive layouts). However, everything runs client-side with seeded profiles and simulated Twilio/Stripe/AWS integrations—there is no backend, database, or production infrastructure. Dependencies like `@google/genai` and `express` are declared but unused, suggesting AI Studio scaffolding rather than implemented server capabilities.

**Paragraph 3 — Honest state assessment:**  
The project is an **ALPHA** interactive spec—a compelling "Spec 1.0 Demo" that proves the UX and matching logic but cannot serve real users. Reaching **BETA** requires a backend (auth, storage, real candidate pool, daily batch jobs), server-enforced business rules, and PCI-compliant payments. Reaching **PRODUCTION** further requires monitoring, moderation, legal compliance, and replacing sandbox shortcuts (instant mutual matches, fake Stripe forms, 30-second lockouts). The strongest asset is the product vision and algorithm; the largest gap is everything behind the browser.

---

```
---
AUDIT METADATA
Project: found
Date: Tuesday, July 7, 2026
Agent: Claude (Cursor agent)
Codebase access: full repo (read-only analysis)
Confidence level: high — small codebase (~23 app files), fully read; low confidence on external AI Studio deployment state (URL not fetched)
Sections with gaps: 1 (git history), 2 (API/database — intentionally absent), 5 (analytics), 8 (portfolio shared code), 10 (operational/DB constraints)
Total files analyzed: 31 (23 application files + 8 config/metadata files; audits/ kit noted but not exhaustively audited)
---
```
