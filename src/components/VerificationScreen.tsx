/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, AlertCircle, RefreshCw, Smartphone, Camera, Check } from 'lucide-react';

interface VerificationScreenProps {
  phoneNumber: string;
  userPhotoUrl: string;
  initialStep?: 'phone' | 'photo';
  onVerified: () => void;
}

export default function VerificationScreen({
  phoneNumber,
  userPhotoUrl,
  initialStep = 'phone',
  onVerified
}: VerificationScreenProps) {
  const [step, setStep] = useState<'phone' | 'photo'>(initialStep);
  const [smsCode, setSmsCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [error, setError] = useState('');
  const [photoAttempts, setPhotoAttempts] = useState(0);
  const [isManualReview, setIsManualReview] = useState(false);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);

  // Generate a random 6-digit code on mount
  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
  }, []);

  // Lockout timer ticking
  useEffect(() => {
    if (isLockedOut && lockoutTime > 0) {
      const interval = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLockedOut, lockoutTime]);

  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLockedOut) {
      setError('You are locked out. Please wait.');
      return;
    }

    if (smsCode === simulatedCode) {
      // Success phone verification
      setStep('photo');
      setError('');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setSmsCode('');

      if (nextAttempts >= 3) {
        setIsLockedOut(true);
        setLockoutTime(30); // Simulate 30-sec cooldown in sandbox for convenience instead of 24 hrs
        setError('3 failed verification attempts. Access is locked for security.');
      } else {
        setError(`Incorrect code. Attempt ${nextAttempts} of 3 before security lockout.`);
      }
    }
  };

  const simulatePhotoVerification = (success: boolean) => {
    setIsVerifyingPhoto(true);
    setError('');

    setTimeout(() => {
      setIsVerifyingPhoto(false);
      if (success) {
        setPhotoVerified(true);
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        const nextPhotoAttempts = photoAttempts + 1;
        setPhotoAttempts(nextPhotoAttempts);

        if (nextPhotoAttempts >= 3) {
          setIsManualReview(true);
        } else {
          setError("your selfie didn't match your photos. try re-uploading photos that look like the real you — we just want to make sure people are who they say they are.");
        }
      }
    }, 1500);
  };

  return (
    <div id="verification-panel" className="max-w-md mx-auto bg-brand-cream border border-[#F0E8DC] rounded-3xl p-8 shadow-xs text-center">
      {step === 'phone' ? (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[#FDF1EB] text-brand-terracotta rounded-full flex items-center justify-center mx-auto">
            <Smartphone size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-semibold text-brand-charcoal">Phone Verification</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              We've dispatched a 6-digit security credential to <span className="font-semibold text-brand-charcoal">{phoneNumber}</span> via Twilio Verify.
            </p>
          </div>

          {/* Simulation Helper */}
          <div className="p-4 bg-brand-beige border border-[#E5DED4] rounded-xl text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-brand-clay uppercase tracking-wider mb-1 font-semibold">
              <span>Simulation Console (Twilio API)</span>
              <span className="text-emerald-600 animate-pulse">● Connected</span>
            </div>
            <p className="text-xs text-brand-charcoal font-medium">
              [Incoming SMS]: "Found Security Code: <span className="font-mono bg-brand-cream px-2 py-0.5 rounded border border-[#E5DED4] text-brand-terracotta text-sm select-all">{simulatedCode}</span>"
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left leading-relaxed">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifySms} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-widest text-brand-stone block">
                Verification PIN
              </label>
              <input
                type="text"
                maxLength={6}
                pattern="\d{6}"
                disabled={isLockedOut}
                placeholder="0 0 0 0 0 0"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[1em] text-2xl border border-[#E5DED4] rounded-xl py-3 bg-transparent text-brand-charcoal font-mono placeholder:tracking-normal placeholder:font-sans focus:border-brand-terracotta focus:outline-hidden"
              />
            </div>

            {isLockedOut ? (
              <div className="bg-red-50 text-red-700 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold">
                <Lock size={14} /> Lockout Cooldown active: {lockoutTime}s
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-brand-charcoal text-brand-beige rounded-xl text-sm font-semibold hover:bg-brand-terracotta transition-colors flex items-center justify-center gap-2"
              >
                Verify Code
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => {
              const code = Math.floor(100000 + Math.random() * 900000).toString();
              setSimulatedCode(code);
            }}
            className="text-xs text-brand-clay hover:text-brand-terracotta font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto py-1"
          >
            <RefreshCw size={12} /> Resend Simulated SMS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[#EBFDF0] text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Camera size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-semibold text-brand-charcoal">Biometric Verification</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              We leverage AWS Rekognition to check your selfie against your profile photo. This ensures authenticity before matchmaking.
            </p>
          </div>

          {/* User profile photo preview */}
          <div className="flex justify-center items-center gap-8 py-4">
            <div className="space-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-charcoal shadow-sm">
                <img
                  src={userPhotoUrl}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] font-mono text-brand-stone uppercase tracking-wider">Your Photo</p>
            </div>

            <div className="text-brand-stone text-xs font-mono">VS</div>

            <div className="space-y-1">
              <div className="w-24 h-24 rounded-full bg-[#FAF7F2] border-2 border-dashed border-[#DCD3C7] flex items-center justify-center overflow-hidden">
                {photoVerified ? (
                  <img
                    src={userPhotoUrl}
                    alt="Selfie"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <Camera size={24} className="text-brand-stone" />
                )}
              </div>
              <p className="text-[10px] font-mono text-brand-stone uppercase tracking-wider">Camera Selfie</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl text-left leading-relaxed flex gap-2">
              <ShieldAlert size={20} className="shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}

          {isManualReview && (
            <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl text-left leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={16} className="text-blue-600" />
                <span>Verification Escalated</span>
              </div>
              <p>
                "we're having trouble verifying your account automatically. we'll take a look manually and follow up via text. this usually takes less than 24 hours."
              </p>
              <button
                onClick={onVerified}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-mono uppercase tracking-wider mt-2 transition-colors"
              >
                Bypass Escalate (Sandbox Overrides)
              </button>
            </div>
          )}

          {photoVerified ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold animate-bounce">
              <ShieldCheck size={18} className="text-emerald-600" /> Verified Successfully!
            </div>
          ) : (
            !isManualReview && (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-widest text-brand-stone">
                  Simulate AWS CompareFaces:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => simulatePhotoVerification(true)}
                    disabled={isVerifyingPhoto}
                    className="py-3 px-4 bg-brand-charcoal text-brand-beige rounded-xl text-xs font-semibold hover:bg-emerald-700 hover:border-emerald-700 border border-brand-charcoal flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isVerifyingPhoto ? 'AWS Scanning...' : <><ShieldCheck size={14} /> Face Match</>}
                  </button>

                  <button
                    onClick={() => simulatePhotoVerification(false)}
                    disabled={isVerifyingPhoto}
                    className="py-3 px-4 bg-transparent text-brand-charcoal rounded-xl text-xs font-semibold hover:bg-amber-100 hover:text-brand-charcoal border border-[#E5DED4] flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isVerifyingPhoto ? 'AWS Scanning...' : <><ShieldAlert size={14} /> Face Mismatch</>}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
