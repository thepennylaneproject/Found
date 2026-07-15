/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Purchase, PurchaseType } from '../types';
import { Sparkles, Shield, Compass, BookOpen, Heart, Music, Home, Clock, Check, Coins } from 'lucide-react';

interface InsightsViewProps {
  currentUser: User;
  insightsUnlocked: boolean;
  onUnlockInsights: () => void;
}

export default function InsightsView({
  currentUser,
  insightsUnlocked,
  onUnlockInsights
}: InsightsViewProps) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(25);
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [isProcessingDonate, setIsProcessingDonate] = useState(false);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setPaySuccess(true);
    setTimeout(() => {
      onUnlockInsights();
      setShowPayModal(false);
      setPaySuccess(false);
    }, 1500);
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingDonate(true);
    setTimeout(() => {
      setIsProcessingDonate(false);
      setDonateSuccess(true);
    }, 1500);
  };

  // Helper to get average index
  const getDimensionStrength = (quizId: number) => {
    const answers = currentUser.quizAnswers.filter(a => a.quizId === quizId);
    if (answers.length === 0) return 60;
    const sum = answers.reduce((total, cur) => total + cur.answer, 0);
    // Normalized to a scale 40-100% for beautiful rendering
    return 50 + Math.round((sum / 15) * 50);
  };

  return (
    <div id="insights-container" className="max-w-2xl mx-auto space-y-12 text-left">
      
      {/* 1. COMPATIBILITY INSIGHTS BLOCK */}
      <div className="bg-brand-cream border border-[#F0E8DC] rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
        
        {/* locked overlay */}
        {!insightsUnlocked && (
          <div className="absolute inset-0 bg-[#FAF8F5]/90 backdrop-blur-xs flex flex-col items-center justify-center p-8 text-center space-y-6 z-10">
            <div className="w-14 h-14 bg-[#FDF1EB] text-brand-terracotta rounded-full flex items-center justify-center">
              <Sparkles size={28} />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="font-display font-semibold text-2xl text-brand-charcoal">Compatibility Insights</h3>
              <p className="text-sm text-brand-stone font-light leading-relaxed">
                Unlock a mathematical vector breakdown of your profile. See precisely how you align across Sonic, Habitat, Love, Beliefs, and Tempo.
              </p>
            </div>
            <div className="pt-2">
              <button
                id="btn-unlock-insights"
                onClick={() => setShowPayModal(true)}
                className="px-6 py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-beige text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition-colors shadow-md"
              >
                Unlock Deep Insights · $9.99
              </button>
              <p className="text-[10px] text-brand-stone font-mono uppercase tracking-widest mt-2">One-time purchase · No recurring bills</p>
            </div>
          </div>
        )}

        {/* Locked/Unlocked Header */}
        <div className="border-b border-[#F0E8DC] pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-display font-semibold text-brand-charcoal">Your Behavioral Map</h3>
            <p className="text-xs font-mono text-brand-stone uppercase tracking-wider">Quantified behavioral metrics</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest bg-brand-charcoal text-[#C58B70] px-3 py-1 rounded-full font-semibold">
            Insights Unlocked
          </span>
        </div>

        {/* Personality Reflections */}
        <div className="space-y-6">
          <div className="p-6 bg-brand-beige rounded-2xl border border-[#E5DED4] space-y-2">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-bold">Synthesized Archetype</h5>
            <p className="text-2xl font-display text-brand-charcoal italic">
              "The Intentionally Unhurried Explorer"
            </p>
            <p className="text-xs text-brand-stone leading-relaxed font-light pt-1">
              You process life with deliberate, unhurried attention. You require comfortable intervals of parallel play, show up physically to express care, and keep works and lives in distinct container compartments.
            </p>
          </div>

          {/* Core vectors compare */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-stone font-semibold">Dimension Vector Score Breakdown</h4>
            
            <div className="space-y-4 pt-2">
              {[
                { name: 'Sonic Identity (music & mood regulation)', id: 1, desc: 'Indicates high emotional register and reliance on quiet comfort.', color: 'bg-brand-terracotta' },
                { name: 'Natural Habitat (spatial cadence)', id: 2, desc: 'Represents strong affinity for early active motion and home stability.', color: 'bg-brand-clay' },
                { name: 'How You Love (attachment & conflict resolution)', id: 3, desc: 'Signals steady, quiet attachment with a processing delay preference.', color: 'bg-red-400' },
                { name: 'What You Believe (values & risk ambition)', id: 4, desc: 'Indicates rooted foundation and collaborative community desires.', color: 'bg-amber-500' },
                { name: 'How You Spend Time (activity & life pace)', id: 5, desc: 'Represents creative, maker-centered focus with intentional time buffers.', color: 'bg-blue-400' },
              ].map((item) => {
                const strength = getDimensionStrength(item.id);
                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-brand-charcoal font-sans">{item.name}</span>
                      <span className="font-mono text-brand-clay font-bold">{strength}% strength</span>
                    </div>
                    <div className="w-full bg-[#EBF0EA] h-2.5 rounded-full overflow-hidden border border-[#E5DED4]">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-1000`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-brand-stone italic font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS DONATION CARD */}
      <div className="bg-brand-charcoal border-2 border-brand-charcoal text-brand-beige rounded-3xl p-8 md:p-12 space-y-6 text-center">
        <div className="w-14 h-14 bg-brand-clay text-brand-beige rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Heart size={28} className="fill-brand-beige" />
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-display font-semibold">found someone? leave gracefully.</h3>
          <p className="text-xs text-brand-beige/80 max-w-sm mx-auto font-light leading-relaxed">
            Our business model is built entirely for your success. We do not charge subscriptions, nor do we benefit from keeping you lonely. If you have found your person here, we ask that you leave gracefully and consider supporting our platform.
          </p>
        </div>

        {donateSuccess ? (
          <div className="p-6 bg-brand-clay text-brand-beige rounded-2xl max-w-md mx-auto space-y-2 border border-brand-beige/20 animate-scale-up">
            <Check size={24} className="mx-auto" />
            <h4 className="font-mono text-xs uppercase tracking-wider font-bold">Donation Processed</h4>
            <p className="text-sm italic">"Thank you for leaving gracefully. We wish you both a beautiful life together."</p>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDonateAmount(amt)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                    donateAmount === amt
                      ? 'bg-brand-clay border-brand-clay text-brand-beige font-bold'
                      : 'bg-transparent border-brand-beige/30 text-brand-beige/80 hover:border-brand-beige'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 bg-brand-stone/40 border border-brand-stone/60 rounded-xl p-2 items-center">
              <span className="text-xs font-mono text-brand-beige/60 px-2">$</span>
              <input
                type="number"
                min={5}
                placeholder="Custom Amount"
                value={donateAmount}
                onChange={(e) => setDonateAmount(parseInt(e.target.value) || 0)}
                className="bg-transparent text-sm font-sans font-semibold border-none focus:outline-hidden flex-1 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessingDonate}
              className="w-full py-3.5 bg-brand-clay hover:bg-brand-terracotta text-brand-beige font-mono text-xs uppercase tracking-widest rounded-full font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              {isProcessingDonate ? 'Processing Donation...' : `Process Success Donation · $${donateAmount}`}
            </button>
          </form>
        )}
      </div>

      {/* Stripe Modal Simulation for Insights */}
      {showPayModal && (
        <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl p-6 max-w-sm w-full space-y-6 text-left shadow-2xl animate-scale-up text-brand-charcoal">
            <div className="flex justify-between items-center border-b border-[#F0E8DC] pb-3">
              <h3 className="font-display font-semibold text-lg">Stripe Checkout</h3>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="text-brand-stone hover:text-brand-charcoal text-xs font-mono"
              >
                [Cancel]
              </button>
            </div>

            {paySuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-bold">
                  Purchase Successful
                </p>
                <p className="text-xs text-brand-stone font-light">
                  Unlocking behavioral map vectors compatibility insights...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-4 text-xs font-mono">
                <div className="p-3 bg-[#FAF7F2] rounded-xl flex justify-between items-center border border-[#E5DED4]">
                  <div>
                    <p className="text-[10px] text-brand-stone uppercase">Add-on</p>
                    <p className="font-sans font-bold text-brand-charcoal">Behavioral Map Insights</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-brand-stone uppercase">Total Due</p>
                    <p className="font-sans font-bold text-brand-terracotta text-sm">$9.99</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-stone uppercase block">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
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
                      className="w-full bg-transparent border border-[#E5DED4] focus:border-brand-charcoal rounded-lg p-2.5 outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-beige rounded-xl font-bold uppercase tracking-wider transition-colors mt-2"
                >
                  Pay $9.99
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
