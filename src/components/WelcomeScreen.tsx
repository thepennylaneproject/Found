/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles, Shield, Compass } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div id="welcome-container" className="flex flex-col items-center justify-center min-h-[85vh] px-4 max-w-4xl mx-auto text-center">
      {/* Editorial branding */}
      <div className="space-y-4 mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1EAE0] text-xs font-mono tracking-wider rounded-full text-brand-clay uppercase">
          <Sparkles size={12} className="text-brand-terracotta" /> No Swiping · No Paywalls
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight text-brand-charcoal">
          found<span className="text-brand-terracotta">.</span>
        </h1>
        <p className="text-xl md:text-2xl font-display italic text-brand-stone max-w-2xl mx-auto font-light">
          "stop looking. start being found."
        </p>
      </div>

      {/* Core Philosophies (The Three Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left max-w-3xl">
        <div className="p-6 bg-brand-cream border border-[#F0E8DC] rounded-2xl shadow-xs transition-transform hover:translate-y-[-2px]">
          <div className="w-10 h-10 flex items-center justify-center bg-[#FDF1EB] rounded-xl text-brand-terracotta mb-4">
            <Compass size={20} />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Quiz-First Onboarding</h3>
          <p className="text-sm text-brand-stone leading-relaxed">
            Scenario-based games bypass superficial self-reports. We identify core behaviors instead of performance.
          </p>
        </div>

        <div className="p-6 bg-brand-cream border border-[#F0E8DC] rounded-2xl shadow-xs transition-transform hover:translate-y-[-2px]">
          <div className="w-10 h-10 flex items-center justify-center bg-[#ECEFFD] rounded-xl text-blue-600 mb-4">
            <Heart size={20} />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">3 Curated Matches Daily</h3>
          <p className="text-sm text-brand-stone leading-relaxed">
            No infinite scroll or dopamine loops. We align with your success—designed for you to meet and leave.
          </p>
        </div>

        <div className="p-6 bg-brand-cream border border-[#F0E8DC] rounded-2xl shadow-xs transition-transform hover:translate-y-[-2px]">
          <div className="w-10 h-10 flex items-center justify-center bg-[#EBFDF0] rounded-xl text-emerald-600 mb-4">
            <Shield size={20} />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Privacy-First Comms</h3>
          <p className="text-sm text-brand-stone leading-relaxed">
            Masked voice calls, proxy SMS, and in-app video via Twilio. No phone numbers exposed, strictly mutual opt-in.
          </p>
        </div>
      </div>

      {/* Primary Action */}
      <div className="space-y-4 animate-fade-in delay-200">
        <button
          id="btn-start-onboarding"
          onClick={onStart}
          className="px-8 py-4 bg-brand-charcoal text-brand-beige font-medium tracking-wide rounded-full text-base transition-all hover:bg-brand-terracotta hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-hidden"
        >
          Begin Onboarding
        </button>
        <p className="text-xs text-brand-stone font-mono uppercase tracking-widest">
          Takes approx. 5 minutes to be found
        </p>
      </div>

      {/* Guarantee Badge */}
      <div className="mt-20 pt-8 border-t border-[#F0E8DC] w-full text-xs text-brand-stone max-w-lg mx-auto">
        <p className="italic">
          "Found will never sell your attention, gate basic messaging, or profit from your loneliness. Our interests are entirely aligned with your connection."
        </p>
      </div>
    </div>
  );
}
