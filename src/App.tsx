/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User, Match, Message, CommunicationPref, Gender, MatchAction, MatchStatus, MessageType
} from './types';
import {
  loadState, saveState, generateMatchesForUser, clearState, AppState
} from './utils/localDb';
import { SEEDED_PROFILES, SeededProfile } from './data/profiles';

import WelcomeScreen from './components/WelcomeScreen';
import RegistrationForm from './components/RegistrationForm';
import VerificationScreen from './components/VerificationScreen';
import QuizOnboarding from './components/QuizOnboarding';
import MatchQueue from './components/MatchQueue';
import DiscoverGrid from './components/DiscoverGrid';
import ChatView from './components/ChatView';
import InsightsView from './components/InsightsView';

import { Sparkles, MessageSquare, Compass, Heart, UserRound, ArrowRight, Shield, X, RefreshCw } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadState());
  const [activeTab, setActiveTab] = useState<'queue' | 'discover' | 'chats' | 'insights'>('queue');
  const [matchedPartner, setMatchedPartner] = useState<SeededProfile | null>(null);

  // Sync state to local storage on change
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  const handleStartOnboarding = () => {
    setAppState(prev => ({
      ...prev,
      user: {
        id: `user-${Date.now()}`,
        name: '',
        age: 25,
        gender: Gender.WOMAN,
        phoneNumber: '',
        phoneVerified: false,
        photoVerified: false,
        verificationAttempts: 0,
        flaggedForReview: false,
        location: 'San Francisco, CA',
        latitude: null,
        longitude: null,
        locationRadius: 25,
        ageRangeMin: 18,
        ageRangeMax: 45,
        onboardingComplete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
        quizAnswers: [],
        dimensionScores: []
      } as User
    }));
  };

  const handleRegistrationComplete = (data: Partial<User>) => {
    setAppState(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          ...data,
          updatedAt: new Date()
        } as User,
        verificationStep: 'phone'
      };
    });
  };

  const handleVerificationComplete = () => {
    setAppState(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          phoneVerified: true,
          photoVerified: true,
          updatedAt: new Date()
        } as User,
        verificationStep: 'complete'
      };
    });
  };

  const handleQuizComplete = (quizAnswers: any[]) => {
    setAppState(prev => {
      if (!prev.user) return prev;
      const updatedUser = {
        ...prev.user,
        quizAnswers,
        onboardingComplete: true,
        updatedAt: new Date()
      } as User;

      // Run algorithm to pre-seed compatible matches
      const calculatedMatches = generateMatchesForUser(updatedUser);

      // Pre-seed some default empty chats and preferences for each calculated match
      const initialCommPrefs: Record<string, CommunicationPref> = {};
      const initialMessages: Record<string, Message[]> = {};

      calculatedMatches.forEach(m => {
        initialCommPrefs[m.id] = {
          id: `pref-${m.id}`,
          matchId: m.id,
          userId: updatedUser.id,
          voiceEnabled: false,
          videoEnabled: false,
          smsEnabled: false,
          updatedAt: new Date()
        };
        initialMessages[m.id] = [];
      });

      return {
        ...prev,
        user: updatedUser,
        matches: calculatedMatches,
        commPrefs: initialCommPrefs,
        messages: initialMessages
      };
    });
  };

  // Process like / pass actions on candidate match cards
  const handleMatchAction = (matchId: string, action: MatchAction) => {
    setAppState(prev => {
      const matchIndex = prev.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev;

      const updatedMatches = [...prev.matches];
      const targetMatch = { ...updatedMatches[matchIndex] };

      targetMatch.aAction = action;
      targetMatch.aActionedAt = new Date();
      targetMatch.updatedAt = new Date();

      if (action === MatchAction.LIKE) {
        // High fidelity sandbox trigger: we always set candidate's action to LIKE as well
        // creating an instant mutual Match connection (status = ACTIVE)
        targetMatch.bAction = MatchAction.LIKE;
        targetMatch.bActionedAt = new Date();
        targetMatch.status = MatchStatus.ACTIVE;

        // Trigger matched modal screen
        const seedPartner = SEEDED_PROFILES.find(p => p.id === targetMatch.userBId);
        if (seedPartner) {
          setMatchedPartner(seedPartner);
        }
      } else {
        targetMatch.status = MatchStatus.ARCHIVED;
      }

      updatedMatches[matchIndex] = targetMatch;
      return {
        ...prev,
        matches: updatedMatches
      };
    });
  };

  const handleSendMessage = (matchId: string, content: string, type: MessageType = MessageType.TEXT) => {
    setAppState(prev => {
      const chatHistory = prev.messages[matchId] || [];
      const newMsg: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        matchId,
        senderId: prev.user?.id || 'me',
        content,
        type,
        readAt: null,
        createdAt: new Date(),
        deletedAt: null
      };

      return {
        ...prev,
        messages: {
          ...prev.messages,
          [matchId]: [...chatHistory, newMsg]
        }
      };
    });
  };

  const handleUpdateCommPrefs = (matchId: string, updatedPrefs: Partial<CommunicationPref>) => {
    setAppState(prev => {
      const current = prev.commPrefs[matchId] || {
        id: `pref-${matchId}`,
        matchId,
        userId: prev.user?.id || 'me',
        voiceEnabled: false,
        videoEnabled: false,
        smsEnabled: false,
        updatedAt: new Date()
      };

      return {
        ...prev,
        commPrefs: {
          ...prev.commPrefs,
          [matchId]: {
            ...current,
            ...updatedPrefs,
            updatedAt: new Date()
          }
        }
      };
    });
  };

  const handleSimulatePartnerOptIn = (matchId: string, tier: 'voice' | 'video' | 'sms') => {
    // Notify in browser simulation console or state logs
    console.log(`[SIMULATION]: Partner opted-in to ${tier} for match ${matchId}`);
  };

  const handleUnlockInsights = () => {
    setAppState(prev => ({ ...prev, insightsUnlocked: true }));
  };

  const handleExpandQueue = () => {
    setAppState(prev => ({ ...prev, queueExpanded: true }));
  };

  const handleResetSandbox = () => {
    clearState();
    setAppState({
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
    });
    setActiveTab('queue');
    setMatchedPartner(null);
  };

  const { user, matches, messages, commPrefs, insightsUnlocked, queueExpanded, verificationStep } = appState;

  // Determine which layout screen to render
  const renderContent = () => {
    if (!user) {
      return <WelcomeScreen onStart={handleStartOnboarding} />;
    }

    if (!user.phoneNumber) {
      return <RegistrationForm onComplete={handleRegistrationComplete} />;
    }

    if (verificationStep !== 'complete') {
      return (
        <VerificationScreen
          phoneNumber={user.phoneNumber}
          userPhotoUrl={user.photos[0]?.url || ''}
          onVerified={handleVerificationComplete}
        />
      );
    }

    if (!user.onboardingComplete) {
      return <QuizOnboarding onComplete={handleQuizComplete} />;
    }

    // Main App Dashboard once onboarding and verification is complete
    return (
      <div className="space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex justify-center border-b border-[#E5DED4] pb-px">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'queue', label: 'Match Queue', icon: <Heart size={14} /> },
              { id: 'discover', label: 'Discover Pool', icon: <Compass size={14} /> },
              { id: 'chats', label: 'Conversations', icon: <MessageSquare size={14} /> },
              { id: 'insights', label: 'My Insights', icon: <Sparkles size={14} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-xs font-mono uppercase tracking-widest transition-all ${
                    isActive
                      ? 'border-brand-terracotta text-brand-charcoal font-bold'
                      : 'border-transparent text-brand-stone hover:text-brand-charcoal hover:border-[#E5DED4]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'chats' && matches.filter(m => m.status === 'ACTIVE').length > 0 && (
                    <span className="bg-brand-terracotta text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold animate-pulse">
                      {matches.filter(m => m.status === 'ACTIVE').length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Subviews */}
        <div className="pt-4">
          {activeTab === 'queue' && (
            <MatchQueue
              currentUser={user}
              matches={matches}
              onAction={handleMatchAction}
              queueExpanded={queueExpanded}
              onExpandQueue={handleExpandQueue}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverGrid
              matches={matches}
              onAction={handleMatchAction}
            />
          )}

          {activeTab === 'chats' && (
            <ChatView
              currentUser={user}
              matches={matches}
              messages={messages}
              commPrefs={commPrefs}
              onSendMessage={handleSendMessage}
              onUpdateCommPrefs={handleUpdateCommPrefs}
              onSimulatePartnerOptIn={handleSimulatePartnerOptIn}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView
              currentUser={user}
              insightsUnlocked={insightsUnlocked}
              onUnlockInsights={handleUnlockInsights}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-beige py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Top Floating App Banner */}
      <header className="max-w-5xl mx-auto mb-10 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-2xl tracking-tighter text-brand-charcoal">
            found<span className="text-brand-terracotta">.</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest bg-[#FAF7F2] text-brand-stone border border-[#E5DED4] px-2 py-0.5 rounded-full font-bold">
            Spec 1.0 Demo
          </span>
        </div>

        {/* Global Reset Button to demo complete flow */}
        <button
          onClick={handleResetSandbox}
          className="text-xs text-brand-stone hover:text-brand-terracotta font-mono uppercase tracking-wider flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5DED4] hover:border-brand-terracotta px-3 py-1.5 rounded-xl transition-all shadow-xs"
        >
          <RefreshCw size={12} /> Reset Sandbox
        </button>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-5xl mx-auto pb-16">
        {renderContent()}
      </main>

      {/* MATCH CONFIRMATION SUCCESS MODAL OVERLAY */}
      {matchedPartner && (
        <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-scale-up">
            <div className="w-16 h-16 bg-[#EBFDF0] text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <Heart size={32} className="fill-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-clay font-bold">Connection Confirmed</span>
              <h2 className="text-4xl font-display font-medium tracking-tight">it's a match!</h2>
            </div>

            <p className="text-sm text-brand-stone leading-relaxed font-light">
              You and <strong className="text-brand-charcoal">{matchedPartner.name}</strong> have connected mutually. Your secure communication line is ready.
            </p>

            {/* Combined profiles view */}
            <div className="flex justify-center items-center gap-4 py-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-charcoal shrink-0 shadow-md">
                <img
                  src={user?.photos[0]?.url || 'https://picsum.photos/seed/me/200'}
                  alt="You"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-brand-stone font-display text-xl italic">+</div>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-charcoal shrink-0 shadow-md">
                <img
                  src={matchedPartner.photos[0]?.url}
                  alt={matchedPartner.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Mindful Communication Notice */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E5DED4] rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-brand-clay font-mono text-[10px] uppercase font-bold tracking-wider">
                <Shield size={12} /> Privacy Protection Protocol
              </div>
              <p className="text-xs text-brand-stone leading-relaxed font-light">
                No phone numbers are exposed. Send messages directly, or toggle masked voice proxy, Twilio video rooms, and SMS proxy in your preferences.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('chats');
                setMatchedPartner(null);
              }}
              className="w-full py-4 bg-brand-charcoal hover:bg-brand-terracotta text-brand-beige rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              Enter Conversation <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
