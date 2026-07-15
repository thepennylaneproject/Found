/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Match, User, Message, MessageType, CommunicationPref } from '../types';
import { SEEDED_PROFILES } from '../data/profiles';
import {
  Send, Phone, Video, MessageSquare, Shield, Check, Image, AlertCircle,
  X, Camera, Volume2, Mic, Eye, Sparkles, UserCheck, Smartphone
} from 'lucide-react';

interface ChatViewProps {
  currentUser: User;
  matches: Match[];
  messages: Record<string, Message[]>;
  commPrefs: Record<string, CommunicationPref>;
  onSendMessage: (matchId: string, content: string, type?: MessageType) => void;
  onUpdateCommPrefs: (matchId: string, prefs: Partial<CommunicationPref>) => void;
  onSimulatePartnerOptIn: (matchId: string, tier: 'voice' | 'video' | 'sms') => void;
}

export default function ChatView({
  currentUser,
  matches,
  messages,
  commPrefs,
  onSendMessage,
  onUpdateCommPrefs,
  onSimulatePartnerOptIn
}: ChatViewProps) {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  
  // Call / Video states
  const [activeCallType, setActiveCallType] = useState<'voice' | 'video' | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter only active mutual matches (status === ACTIVE)
  const activeMatches = matches.filter(m => m.status === 'ACTIVE');

  // Load chat and scroll to bottom
  const activeMatch = activeMatches.find(m => m.id === activeMatchId);
  const activePartner = activeMatch
    ? SEEDED_PROFILES.find(p => p.id === (activeMatch.userAId === currentUser.id ? activeMatch.userBId : activeMatch.userAId))
    : null;

  const chatMessages = activeMatchId ? (messages[activeMatchId] || []) : [];
  const prefs = activeMatchId ? (commPrefs[activeMatchId] || {
    id: `pref-${activeMatchId}`,
    matchId: activeMatchId,
    userId: currentUser.id,
    voiceEnabled: false,
    videoEnabled: false,
    smsEnabled: false,
    updatedAt: new Date()
  }) : null;

  // Simulate Partner's Prefs state (We'll check partner's opt-ins in local storage metadata)
  const [partnerVoice, setPartnerVoice] = useState<Record<string, boolean>>({});
  const [partnerVideo, setPartnerVideo] = useState<Record<string, boolean>>({});
  const [partnerSms, setPartnerSms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeMatchId]);

  // Handle active call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallType) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCallType]);

  // Request camera for video call simulation
  const startLocalCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera permission denied, using placeholder simulation", err);
    }
  };

  const stopLocalCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatchId) return;

    onSendMessage(activeMatchId, inputText.trim(), MessageType.TEXT);
    setInputText('');

    // Trigger high-quality chatbot response helper after a realistic delay
    const activePartnerName = activePartner?.name || 'Your match';
    const partnerGreeting = activePartner?.initialChatGreeting || "Hey! I'm glad we connected.";
    
    setTimeout(() => {
      let replyText = `I totally agree with you! It's so refreshing to converse here. What's your take on the matching dimension breakdown?`;
      if (chatMessages.length === 1) {
        replyText = `Thanks for writing back! I was looking at our compatibility breakdown, and it's pretty wild how identical our sonic and natural habitat scores are. Do you play any music yourself?`;
      } else if (inputText.toLowerCase().includes('hello') || inputText.toLowerCase().includes('hey')) {
        replyText = `Hey there! Yes, I was really excited when our profile popped up in my curated queue today. What made you decide to join Found?`;
      } else if (inputText.toLowerCase().includes('music') || inputText.toLowerCase().includes('song')) {
        replyText = `Oh, I could talk about music all day! Lately I've had this obscure folk record on repeat. Let me know if you want to swap a link to our current favorite songs!`;
      } else if (inputText.toLowerCase().includes('voice') || inputText.toLowerCase().includes('call') || inputText.toLowerCase().includes('phone')) {
        replyText = `I'd love to chat on voice! I just checked the 'Voice' opt-in. Once you do too, Twilio will allocate us a secure, anonymous proxy line automatically.`;
      } else if (inputText.toLowerCase().includes('video') || inputText.toLowerCase().includes('camera')) {
        replyText = `Yes! Let's do a video call inside the app. I've opted in on my end. Press the video icon at the top to enable peer connection.`;
      } else if (inputText.toLowerCase().includes('sms') || inputText.toLowerCase().includes('text')) {
        replyText = `Proxy SMS is so convenient. I've enabled it. Once we both do, we can text directly from our standard phone SMS apps using Twilio's masked routing!`;
      }

      onSendMessage(activeMatchId, replyText, MessageType.TEXT);
    }, 2000);
  };

  const handleSendPhoto = (photoUrl: string) => {
    if (!activeMatchId) return;
    onSendMessage(activeMatchId, photoUrl, MessageType.PHOTO);
    setShowPhotoSelector(false);

    // Simulated reply
    setTimeout(() => {
      onSendMessage(activeMatchId, "Whoa, that looks incredibly beautiful! Thanks for sharing this photograph with me.", MessageType.TEXT);
    }, 2000);
  };

  const toggleCommPreference = (tier: 'voice' | 'video' | 'sms') => {
    if (!activeMatchId || !prefs) return;

    const nextPrefs = { ...prefs };
    if (tier === 'voice') nextPrefs.voiceEnabled = !prefs.voiceEnabled;
    if (tier === 'video') nextPrefs.videoEnabled = !prefs.videoEnabled;
    if (tier === 'sms') nextPrefs.smsEnabled = !prefs.smsEnabled;

    onUpdateCommPrefs(activeMatchId, nextPrefs);
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setActiveCallType(type);
    if (type === 'video') {
      startLocalCamera();
    }
  };

  const handleEndCall = () => {
    stopLocalCamera();
    setActiveCallType(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Check mutual activation
  const isVoiceMutual = prefs?.voiceEnabled && partnerVoice[activeMatchId || ''];
  const isVideoMutual = prefs?.videoEnabled && partnerVideo[activeMatchId || ''];
  const isSmsMutual = prefs?.smsEnabled && partnerSms[activeMatchId || ''];

  const triggerPartnerOptInSim = (tier: 'voice' | 'video' | 'sms') => {
    if (!activeMatchId) return;
    if (tier === 'voice') setPartnerVoice({ ...partnerVoice, [activeMatchId]: true });
    if (tier === 'video') setPartnerVideo({ ...partnerVideo, [activeMatchId]: true });
    if (tier === 'sms') setPartnerSms({ ...partnerSms, [activeMatchId]: true });
    
    onSimulatePartnerOptIn(activeMatchId, tier);
  };

  return (
    <div id="conversations-panel" className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 bg-brand-cream border-2 border-brand-charcoal rounded-3xl overflow-hidden shadow-md min-h-[75vh]">
      
      {/* Left Columns - Match conversations list */}
      <div className="border-r border-[#E5DED4] p-4 flex flex-col h-[75vh] bg-[#FAF7F2]">
        <div className="pb-4 border-b border-[#E5DED4] mb-4">
          <h3 className="font-display font-semibold text-lg text-brand-charcoal">Conversations</h3>
          <p className="text-[10px] font-mono text-brand-stone uppercase tracking-wider">Privacy-first connections</p>
        </div>

        {activeMatches.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
            <MessageSquare size={32} className="text-[#E5DED4]" />
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              No mutual connections yet. Connect with high-compatibility recommendations in your daily match queue.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2">
            {activeMatches.map(match => {
              const partnerId = match.userAId === currentUser.id ? match.userBId : match.userAId;
              const seedPartner = SEEDED_PROFILES.find(p => p.id === partnerId);
              if (!seedPartner) return null;

              const isSelected = match.id === activeMatchId;
              const lastMsgs = messages[match.id] || [];
              const lastMsg = lastMsgs[lastMsgs.length - 1];

              return (
                <button
                  key={match.id}
                  onClick={() => setActiveMatchId(match.id)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-charcoal border-brand-charcoal text-brand-beige'
                      : 'bg-brand-cream border-[#E5DED4] text-brand-charcoal hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-brand-stone">
                    <img
                      src={seedPartner.photos[0]?.url}
                      alt={seedPartner.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-sm truncate">{seedPartner.name}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-brand-clay' : 'text-brand-stone'}`}>
                        {match.displayScore}% match
                      </span>
                    </div>
                    <p className={`text-xs truncate ${isSelected ? 'text-brand-beige/80 font-light' : 'text-brand-stone font-light'}`}>
                      {lastMsg ? (lastMsg.type === MessageType.PHOTO ? '📷 sent a photograph' : lastMsg.content) : seedPartner.bio}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column - Active Chat & Comms */}
      <div className="md:col-span-2 flex flex-col h-[75vh] bg-brand-cream relative">
        {activeMatch && activePartner && prefs ? (
          <>
            {/* Header with connection tier buttons */}
            <div className="p-4 border-b border-[#E5DED4] flex justify-between items-center bg-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-charcoal shrink-0">
                  <img
                    src={activePartner.photos[0]?.url}
                    alt={activePartner.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-display font-semibold text-sm text-brand-charcoal">{activePartner.name}</h4>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <Check size={8} /> Active connection
                  </span>
                </div>
              </div>

              {/* Secure Comms Control Buttons */}
              <div className="flex gap-1.5">
                {/* Voice Call Button */}
                <button
                  onClick={() => toggleCommPreference('voice')}
                  title="Enable Masked Voice Proxy"
                  className={`p-2.5 rounded-xl border transition-all relative group ${
                    isVoiceMutual
                      ? 'bg-[#EBFDF0] border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                      : prefs.voiceEnabled
                      ? 'bg-[#FDF1EB] border-brand-clay text-brand-clay'
                      : 'bg-transparent border-[#E5DED4] text-brand-stone hover:text-brand-charcoal'
                  }`}
                >
                  <Phone size={16} />
                  {isVoiceMutual && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 w-2.5 h-2.5 rounded-full border border-white" />
                  )}
                  {/* Tooltip hint */}
                  <span className="absolute top-full right-0 mt-2 hidden group-hover:block bg-brand-charcoal text-brand-beige text-[10px] font-mono uppercase p-2 rounded-md tracking-wider shadow-lg z-20 whitespace-nowrap">
                    {isVoiceMutual ? 'Masked Voice Call Ready' : prefs.voiceEnabled ? 'Voice opt-in saved' : 'Opt-in Masked Voice'}
                  </span>
                </button>

                {/* Video Call Button */}
                <button
                  onClick={() => toggleCommPreference('video')}
                  title="Enable In-App Video"
                  className={`p-2.5 rounded-xl border transition-all relative group ${
                    isVideoMutual
                      ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                      : prefs.videoEnabled
                      ? 'bg-[#FDF1EB] border-brand-clay text-brand-clay'
                      : 'bg-transparent border-[#E5DED4] text-brand-stone hover:text-brand-charcoal'
                  }`}
                >
                  <Video size={16} />
                  {isVideoMutual && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 w-2.5 h-2.5 rounded-full border border-white" />
                  )}
                  <span className="absolute top-full right-0 mt-2 hidden group-hover:block bg-brand-charcoal text-brand-beige text-[10px] font-mono uppercase p-2 rounded-md tracking-wider shadow-lg z-20 whitespace-nowrap">
                    {isVideoMutual ? 'Video Room Enabled' : prefs.videoEnabled ? 'Video opt-in saved' : 'Opt-in Video Room'}
                  </span>
                </button>

                {/* SMS Proxy Button */}
                <button
                  onClick={() => toggleCommPreference('sms')}
                  title="Enable Twilio Masked SMS Proxy"
                  className={`p-2.5 rounded-xl border transition-all relative group ${
                    isSmsMutual
                      ? 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100'
                      : prefs.smsEnabled
                      ? 'bg-[#FDF1EB] border-brand-clay text-brand-clay'
                      : 'bg-transparent border-[#E5DED4] text-brand-stone hover:text-brand-charcoal'
                  }`}
                >
                  <Smartphone size={16} />
                  {isSmsMutual && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 w-2.5 h-2.5 rounded-full border border-white" />
                  )}
                  <span className="absolute top-full right-0 mt-2 hidden group-hover:block bg-brand-charcoal text-brand-beige text-[10px] font-mono uppercase p-2 rounded-md tracking-wider shadow-lg z-20 whitespace-nowrap">
                    {isSmsMutual ? 'Proxy SMS Active' : prefs.smsEnabled ? 'SMS opt-in saved' : 'Opt-in Masked SMS'}
                  </span>
                </button>
              </div>
            </div>

            {/* Privacy Sandbox Status Notification / Sandbox Opt-in Simulator */}
            <div className="px-4 py-2 bg-[#FAF7F2] border-b border-[#E5DED4] flex flex-col gap-1.5 text-left text-xs font-mono">
              <div className="flex items-center justify-between text-[10px] uppercase text-brand-clay font-bold tracking-wider">
                <span>Privacy & Verification Sandbox Console (Twilio Mock APIs)</span>
                <span className="text-emerald-600">● Mutual Controls Live</span>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {/* Voice Sim status */}
                <div className="flex items-center gap-1 bg-brand-cream border border-[#E5DED4] px-2 py-0.5 rounded text-[10px]">
                  <span>Voice: {prefs.voiceEnabled ? '✓ You Opted In' : '✗ You Opted Out'}</span>
                  {!partnerVoice[activeMatch.id] && (
                    <button
                      onClick={() => triggerPartnerOptInSim('voice')}
                      className="ml-1 text-brand-terracotta underline hover:text-brand-charcoal"
                    >
                      (Simulate {activePartner.name} Opts-in)
                    </button>
                  )}
                  {partnerVoice[activeMatch.id] && <span className="text-emerald-600 font-bold ml-1">({activePartner.name} Opted In)</span>}
                </div>

                {/* Video Sim status */}
                <div className="flex items-center gap-1 bg-brand-cream border border-[#E5DED4] px-2 py-0.5 rounded text-[10px]">
                  <span>Video: {prefs.videoEnabled ? '✓ You Opted In' : '✗ You Opted Out'}</span>
                  {!partnerVideo[activeMatch.id] && (
                    <button
                      onClick={() => triggerPartnerOptInSim('video')}
                      className="ml-1 text-brand-terracotta underline hover:text-brand-charcoal"
                    >
                      (Simulate {activePartner.name} Opts-in)
                    </button>
                  )}
                  {partnerVideo[activeMatch.id] && <span className="text-blue-600 font-bold ml-1">({activePartner.name} Opted In)</span>}
                </div>

                {/* SMS Sim status */}
                <div className="flex items-center gap-1 bg-brand-cream border border-[#E5DED4] px-2 py-0.5 rounded text-[10px]">
                  <span>SMS: {prefs.smsEnabled ? '✓ You Opted In' : '✗ You Opted Out'}</span>
                  {!partnerSms[activeMatch.id] && (
                    <button
                      onClick={() => triggerPartnerOptInSim('sms')}
                      className="ml-1 text-brand-terracotta underline hover:text-brand-charcoal"
                    >
                      (Simulate {activePartner.name} Opts-in)
                    </button>
                  )}
                  {partnerSms[activeMatch.id] && <span className="text-purple-600 font-bold ml-1">({activePartner.name} Opted In)</span>}
                </div>
              </div>

              {/* MUTUAL ACTION NOTIFICATIONS */}
              {isVoiceMutual && !activeCallType && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-[11px] animate-bounce">
                  <span>✓ You and {activePartner.name} have mutually activated voice comms. Secure calling proxy is active.</span>
                  <button
                    onClick={() => handleStartCall('voice')}
                    className="bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold hover:bg-emerald-700"
                  >
                    Call Anonymous Line
                  </button>
                </div>
              )}

              {isVideoMutual && !activeCallType && (
                <div className="p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-between text-[11px] mt-1">
                  <span>✓ You and {activePartner.name} have mutually enabled in-app video meetings. Twilio Video room is created.</span>
                  <button
                    onClick={() => handleStartCall('video')}
                    className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold hover:bg-blue-700"
                  >
                    Join Video Room
                  </button>
                </div>
              )}

              {isSmsMutual && (
                <div className="p-2 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-[10px] space-y-1">
                  <p className="font-semibold">✓ Mutual Proxy SMS Enabled by both participants.</p>
                  <p className="font-light">Twilio Allocated SMS Mask: <strong className="font-mono bg-brand-cream px-1.5 py-0.5 rounded border border-purple-300 text-purple-700 text-xs">+1 (415) 555-0192</strong></p>
                  <p className="text-[9px] text-brand-stone font-light italic">"Standard SMS texts to this line are delivered securely and anonymously via Twilio Proxy to each other's phone."</p>
                </div>
              )}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-brand-stone space-y-3">
                  <p className="text-sm font-light">Your communication channel is established.</p>
                  <button
                    onClick={() => onSendMessage(activeMatchId, activePartner.initialChatGreeting, MessageType.TEXT)}
                    className="px-4 py-2 bg-brand-charcoal text-brand-beige text-xs font-mono uppercase tracking-widest rounded-xl hover:bg-brand-terracotta transition-colors"
                  >
                    Send Partner's Initial Prompt
                  </button>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-xs md:max-w-md rounded-2xl p-4 text-left shadow-xs ${
                        isMe
                          ? 'bg-brand-charcoal text-brand-beige rounded-br-none'
                          : 'bg-[#F2ECE4] text-brand-charcoal rounded-bl-none border border-[#E5DED4]'
                      }`}>
                        {msg.type === MessageType.PHOTO ? (
                          <div className="space-y-1.5">
                            <img
                              src={msg.content}
                              alt="Attachment"
                              referrerPolicy="no-referrer"
                              className="rounded-lg object-cover max-h-48 w-full"
                            />
                            <p className="text-[10px] font-mono uppercase text-brand-clay tracking-wider">
                              📷 Photograph Attachment
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}
                        <span className={`block text-[8px] font-mono mt-1 text-right ${
                          isMe ? 'text-brand-beige/60' : 'text-brand-stone'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#E5DED4] flex gap-2 bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                title="Attach Photo"
                className="p-3 bg-brand-cream border border-[#E5DED4] hover:bg-brand-charcoal hover:text-brand-beige transition-all rounded-xl text-brand-stone"
              >
                <Image size={18} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Mindful message to ${activePartner.name}...`}
                className="flex-1 bg-brand-cream border border-[#E5DED4] focus:border-brand-charcoal rounded-xl px-4 text-sm focus:outline-hidden transition-colors text-brand-charcoal"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-brand-charcoal text-brand-beige disabled:opacity-40 hover:bg-brand-terracotta rounded-xl transition-colors"
              >
                <Send size={18} />
              </button>
            </form>

            {/* Simulated Photo Selector */}
            {showPhotoSelector && (
              <div className="absolute bottom-20 left-4 bg-brand-cream border-2 border-brand-charcoal rounded-2xl p-4 shadow-xl z-20 space-y-3 max-w-xs animate-scale-up">
                <div className="flex justify-between items-center pb-2 border-b border-[#E5DED4]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-stone">Send Photograph</span>
                  <button onClick={() => setShowPhotoSelector(false)} className="text-brand-stone hover:text-brand-charcoal">
                    <X size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&h=300&q=80", // Forest nature
                    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=300&h=300&q=80", // Sunny park
                    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&h=300&q=80"  // Art desk
                  ].map((pUrl, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPhoto(pUrl)}
                      className="w-16 h-16 rounded-xl overflow-hidden hover:scale-105 transition-transform border border-[#E5DED4]"
                    >
                      <img
                        src={pUrl}
                        alt={`Attachment-${i}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CALL OVERLAYS (VOICE & VIDEO ROOMS) */}
            {activeCallType && (
              <div className="absolute inset-0 bg-brand-charcoal text-brand-beige z-30 flex flex-col justify-between p-8 animate-scale-up">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-brand-stone/40 border border-brand-stone/60 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#C58B70]">
                    <Shield size={12} /> Secure Twilio Proxy Call
                  </div>
                  <div className="text-sm font-mono tracking-wider bg-brand-stone/40 px-3 py-1 rounded-full">
                    {formatTimer(callTimer)}
                  </div>
                </div>

                {/* Call center feed */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  {activeCallType === 'video' ? (
                    <div className="relative w-full max-w-md aspect-video bg-black rounded-3xl overflow-hidden border border-brand-stone/80 shadow-2xl flex items-center justify-center">
                      {/* Partner feed loop simulated */}
                      <img
                        src={activePartner.photos[1]?.url || activePartner.photos[0]?.url}
                        alt="Partner video feed"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute top-3 left-3 bg-brand-charcoal/80 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase">
                        {activePartner.name} (Remote)
                      </div>

                      {/* Local Webcam Pip Feed */}
                      <div className="absolute bottom-3 right-3 w-28 aspect-video bg-zinc-900 border border-brand-stone rounded-xl overflow-hidden shadow-md flex items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {!localStream && <Camera size={16} className="text-zinc-600 animate-pulse" />}
                      </div>
                    </div>
                  ) : (
                    /* Voice Call display card */
                    <div className="text-center space-y-4">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-brand-clay shadow-xl mx-auto ring-8 ring-brand-clay/10 animate-pulse">
                        <img
                          src={activePartner.photos[0]?.url}
                          alt={activePartner.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-2xl font-display font-semibold">{activePartner.name}</h4>
                        <p className="text-xs font-mono text-brand-clay uppercase tracking-widest font-semibold">Masked twilio session</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Panel Footer */}
                <div className="flex justify-center items-center gap-6 pb-6">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full border transition-colors ${
                      isMuted ? 'bg-red-600 border-red-600 text-white' : 'bg-brand-stone/40 border-brand-stone hover:bg-brand-stone'
                    }`}
                  >
                    <Mic size={20} className={isMuted ? 'animate-pulse' : ''} />
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="p-5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <X size={24} />
                  </button>

                  <button
                    onClick={() => setIsSpeaker(!isSpeaker)}
                    className={`p-4 rounded-full border transition-colors ${
                      isSpeaker ? 'bg-brand-clay border-brand-clay text-white' : 'bg-brand-stone/40 border-brand-stone hover:bg-brand-stone'
                    }`}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <MessageSquare size={48} className="text-[#E5DED4]" />
            <h4 className="font-display font-bold text-brand-charcoal text-xl">Privacy-First Conversations</h4>
            <p className="text-sm text-brand-stone max-w-sm font-light leading-relaxed">
              Select an active match conversation from the left bar to exchange text, attach photographs, and activate secure masked communications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
