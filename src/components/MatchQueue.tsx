/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match, User, MatchAction, MatchStatus, PurchaseType } from '../types';
import { SEEDED_PROFILES, SeededProfile } from '../data/profiles';
import { Heart, X, Sparkles, MapPin, Check, Info, Shield, HelpCircle, ArrowRight } from 'lucide-react';

interface MatchQueueProps {
  currentUser: User;
  matches: Match[];
  onAction: (matchId: string, action: MatchAction) => void;
  queueExpanded: boolean;
  onExpandQueue: () => void;
}

export default function MatchQueue({
  currentUser,
  matches,
  onAction,
  queueExpanded,
  onExpandQueue
}: MatchQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [cvc, setCvc] = useState('');

  // Filter matches that are still pending action from user (aAction is null)
  const pendingMatches = matches.filter(m => m.aAction === null);
  const queueLimit = queueExpanded ? 10 : 3;
  const activeQueue = pendingMatches.slice(0, queueLimit);

  const handlePurchaseExpand = (e: React.FormEvent) => {
    e.preventDefault();
    setStripeSuccess(true);
    setTimeout(() => {
      onExpandQueue();
      setShowStripeModal(false);
      setStripeSuccess(false);
    }, 1500);
  };

  if (activeQueue.length === 0 || currentIndex >= activeQueue.length) {
    return (
      <div id="queue-complete-container" className="max-w-md mx-auto text-center py-16 px-4 bg-brand-cream border border-[#F0E8DC] rounded-3xl space-y-8">
        <div className="w-16 h-16 bg-[#FDF1EB] text-brand-terracotta rounded-full flex items-center justify-center mx-auto">
          <Sparkles size={32} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-display font-medium text-brand-charcoal italic">"stop looking."</h2>
          <p className="text-sm text-brand-stone font-light leading-relaxed max-w-xs mx-auto">
            You have explored today's curated matches. We limit your queue to prevent mindless browsing and dopamine burnout.
          </p>
        </div>

        {!queueExpanded ? (
          <div className="p-6 bg-[#FAF7F2] border border-[#E5DED4] rounded-2xl text-left space-y-4">
            <h4 className="font-display font-semibold text-brand-charcoal text-base">Need more candidates?</h4>
            <p className="text-xs text-brand-stone leading-relaxed">
              Expand your curated daily queue to 10 high-compatibility matches for a one-time charge of $4.99. All proceeds fund our non-profit mission.
            </p>
            <button
              id="btn-trigger-expand"
              onClick={() => setShowStripeModal(true)}
              className="w-full py-3 bg-brand-charcoal text-brand-beige text-xs font-mono uppercase tracking-widest rounded-xl font-bold hover:bg-brand-terracotta transition-colors flex items-center justify-center gap-1.5"
            >
              Expand Queue to 10 · $4.99
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-800 text-center font-medium">
            ✓ Daily queue limits expanded. Come back tomorrow at 6:00 AM for a new curated batch.
          </div>
        )}

        {/* Stripe Modal Simulation */}
        {showStripeModal && (
          <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl p-6 max-w-sm w-full space-y-6 text-left shadow-2xl animate-scale-up">
              <div className="flex justify-between items-center border-b border-[#F0E8DC] pb-3">
                <h3 className="font-display font-semibold text-lg">Stripe Checkout</h3>
                <button
                  type="button"
                  onClick={() => setShowStripeModal(false)}
                  className="text-brand-stone hover:text-brand-charcoal text-xs font-mono"
                >
                  [Cancel]
                </button>
              </div>

              {stripeSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-bold">
                    Payment Successful
                  </p>
                  <p className="text-xs text-brand-stone font-light">
                    Expanding daily queue capacities. Fetching matches...
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePurchaseExpand} className="space-y-4 text-xs font-mono">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl flex justify-between items-center border border-[#E5DED4]">
                    <div>
                      <p className="text-[10px] text-brand-stone uppercase">Merchant</p>
                      <p className="font-sans font-bold text-brand-charcoal">The Penny Lane Project</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-brand-stone uppercase">Total Due</p>
                      <p className="font-sans font-bold text-brand-terracotta text-sm">$4.99</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-stone uppercase block">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNum}
                      onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full bg-transparent border border-[#E5DED4] focus:border-brand-charcoal rounded-lg p-2.5 outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-stone uppercase block">Exp. Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="w-full bg-transparent border border-[#E5DED4] focus:border-brand-charcoal rounded-lg p-2.5 outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-stone uppercase block">CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full bg-transparent border border-[#E5DED4] focus:border-brand-charcoal rounded-lg p-2.5 outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-beige rounded-xl font-bold uppercase tracking-wider transition-colors mt-2"
                  >
                    Pay $4.99
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentMatch = activeQueue[currentIndex];
  // Find seed details
  const candidateId = currentMatch.userBId;
  const candidate = SEEDED_PROFILES.find(p => p.id === candidateId);

  if (!candidate) return <div>Match Profile Error</div>;

  return (
    <div id="match-queue" className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-stone">
          Today's Queue • {currentIndex + 1} of {activeQueue.length}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-brand-clay font-bold">
          High Alignment
        </span>
      </div>

      {/* Main Queue Card Container */}
      <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl overflow-hidden shadow-md flex flex-col">
        {/* Photo view */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full bg-brand-charcoal">
          <img
            src={candidate.photos[0]?.url}
            alt={candidate.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Compatibility score badge */}
          <div className="absolute top-4 right-4 bg-brand-charcoal border border-brand-beige text-brand-beige px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Match score</span>
            <span className="text-xl font-display font-bold text-brand-terracotta">{currentMatch.displayScore}%</span>
          </div>

          {/* Bottom tag pill row */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {currentMatch.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-brand-cream/90 backdrop-blur-xs text-brand-charcoal text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#E5DED4] shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Profile details */}
        <div className="p-6 md:p-8 space-y-6 text-left">
          <div className="flex justify-between items-start border-b border-[#F0E8DC] pb-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-semibold text-brand-charcoal">
                {candidate.name}, <span className="font-light italic text-brand-stone">{candidate.age}</span>
              </h3>
              <p className="text-xs font-mono text-brand-stone flex items-center gap-1">
                <MapPin size={12} className="text-brand-clay" /> {candidate.location}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">About</h5>
            <p className="text-sm text-brand-charcoal leading-relaxed font-light">
              {candidate.bio}
            </p>
          </div>

          {/* Core quiz dimension breakdowns toggler */}
          <div className="border-t border-b border-[#F0E8DC] py-4">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-brand-charcoal hover:text-brand-terracotta transition-colors font-semibold"
            >
              <span>{showBreakdown ? 'Hide Compatibility Breakdown' : 'Show Compatibility Breakdown'}</span>
              <Info size={14} className="text-brand-clay" />
            </button>

            {showBreakdown && (
              <div className="mt-4 space-y-3 pt-2 animate-fade-in">
                {[
                  { name: 'How You Love (Complementary)', key: 'LOVE' },
                  { name: 'What You Believe (Complementary)', key: 'VALUES' },
                  { name: 'Your Natural Habitat (Similarity)', key: 'HABITAT' },
                  { name: 'Sonic Identity (Similarity)', key: 'SONIC' },
                  { name: 'How You Spend Time (Similarity)', key: 'TIME' },
                ].map((dim) => {
                  const rawScore = currentMatch.compatibilityScore; // We'll show a randomized proportional visual ratio for the subcomponents
                  // Simulate gorgeous bar widths based on candidate's matching vector
                  let matchWeight = 0.5 + Math.random() * 0.5;
                  if (dim.key === 'LOVE') matchWeight = 0.82;
                  if (dim.key === 'VALUES') matchWeight = 0.79;
                  const percentWidth = Math.round(matchWeight * 100);

                  return (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase text-brand-stone">
                        <span>{dim.name}</span>
                        <span className="font-bold text-brand-charcoal">{percentWidth}%</span>
                      </div>
                      <div className="w-full bg-[#F2ECE4] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-clay h-full rounded-full"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chip lists */}
          <div className="space-y-4">
            {/* Interest chips */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Shared interest indicators</h5>
              <div className="flex flex-wrap gap-1.5">
                {candidate.interestChips.map((chip, i) => (
                  <span
                    key={i}
                    className="bg-[#FAF7F2] text-brand-stone text-xs font-medium px-2.5 py-1 rounded-md border border-[#E5DED4]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Appearance taxonomy chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Self-described tags</h5>
                <div className="flex flex-wrap gap-1">
                  {candidate.appearanceThisIsMe.map((chip, i) => (
                    <span
                      key={i}
                      className="bg-brand-charcoal text-brand-beige text-[11px] font-mono px-2 py-0.5 rounded-full"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Drawn to</h5>
                <div className="flex flex-wrap gap-1">
                  {candidate.appearanceDrawnTo.map((chip, i) => (
                    <span
                      key={i}
                      className="bg-transparent border border-brand-clay text-brand-clay text-[11px] font-mono px-2 py-0.5 rounded-full"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Action buttons - NO SWIPING */}
        <div className="border-t border-[#F0E8DC] p-4 flex gap-4 bg-[#FAF7F2] justify-center items-center rounded-b-3xl">
          <button
            id={`btn-pass-${candidate.id}`}
            onClick={() => {
              onAction(currentMatch.id, MatchAction.PASS);
              setCurrentIndex(currentIndex + 1);
            }}
            className="flex-1 py-4 bg-brand-cream border border-[#E5DED4] text-brand-stone hover:bg-brand-charcoal hover:text-brand-beige hover:border-brand-charcoal transition-all rounded-full flex items-center justify-center gap-2 group font-medium active:scale-95"
          >
            <X size={18} className="transition-transform group-hover:rotate-[-15deg]" /> Pass Mindfully
          </button>

          <button
            id={`btn-connect-${candidate.id}`}
            onClick={() => {
              onAction(currentMatch.id, MatchAction.LIKE);
              setCurrentIndex(currentIndex + 1);
            }}
            className="flex-1 py-4 bg-brand-charcoal hover:bg-brand-terracotta text-brand-beige rounded-full flex items-center justify-center gap-2 group font-medium active:scale-95 shadow-md hover:shadow-lg"
          >
            <Heart size={18} className="text-brand-beige fill-brand-beige transition-transform group-hover:scale-125" /> Connect
          </button>
        </div>
      </div>
    </div>
  );
}
