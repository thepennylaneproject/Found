/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Gender, Photo } from '../types';
import { Sparkles, MapPin, Phone, UserRound, ArrowRight, Upload, X } from 'lucide-react';

interface RegistrationFormProps {
  onComplete: (data: Partial<User>) => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80",
];

export default function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<Gender>(Gender.WOMAN);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [locationRadius, setLocationRadius] = useState<number>(25);
  const [ageRangeMin, setAgeRangeMin] = useState<number>(18);
  const [ageRangeMax, setAgeRangeMax] = useState<number>(45);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');

  const selectPresetAvatar = (url: string) => {
    if (photos.includes(url)) {
      setPhotos(photos.filter(p => p !== url));
    } else {
      if (photos.length >= 4) {
        setError("You can select up to 4 photos.");
        return;
      }
      setPhotos([...photos, url]);
      setError('');
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 4) {
        setError("You can select up to 4 photos.");
        return;
      }
      // Create local object URL for instant preview
      const url = URL.createObjectURL(file);
      setPhotos([...photos, url]);
      setError('');
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (age < 18) {
      setError('You must be 18 or older to register.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please provide a valid phone number.');
      return;
    }
    if (photos.length === 0) {
      setError('Please select at least one profile photo.');
      return;
    }

    const photoObjects: Photo[] = photos.map((url, index) => ({
      id: `photo-${index}`,
      userId: 'temp-id',
      url,
      publicId: `pub-${index}`,
      order: index + 1,
    }));

    onComplete({
      name,
      age,
      gender,
      phoneNumber,
      location,
      locationRadius,
      ageRangeMin,
      ageRangeMax,
      photos: photoObjects,
    });
  };

  return (
    <div id="register-container" className="max-w-2xl mx-auto bg-brand-cream border border-[#F0E8DC] p-8 md:p-12 rounded-3xl shadow-xs">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-display font-semibold text-brand-charcoal mb-2">Create Your Profile</h2>
        <p className="text-sm text-brand-stone font-light">
          Let's construct the canvas of who you are. These basics place you in the discovery system.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        {/* Core details row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-stone flex items-center gap-1.5">
              <UserRound size={12} className="text-brand-clay" /> First Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-[#E5DED4] focus:border-brand-terracotta bg-transparent py-2 outline-hidden text-brand-charcoal transition-colors font-medium text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-stone">
              Age
            </label>
            <input
              type="number"
              required
              min={18}
              max={99}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              className="w-full border-b border-[#E5DED4] focus:border-brand-terracotta bg-transparent py-2 outline-hidden text-brand-charcoal transition-colors font-medium text-lg"
            />
          </div>
        </div>

        {/* Gender select */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-widest text-brand-stone block">
            Gender Identity
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Woman', val: Gender.WOMAN },
              { label: 'Man', val: Gender.MAN },
              { label: 'Nonbinary', val: Gender.NONBINARY },
              { label: 'Prefer not to say', val: Gender.PREFER_NOT_TO_SAY },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setGender(opt.val)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-center ${
                  gender === opt.val
                    ? 'bg-brand-charcoal border-brand-charcoal text-brand-beige'
                    : 'bg-transparent border-[#E5DED4] text-brand-charcoal hover:bg-[#F2ECE4]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-stone flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-clay" /> Location (City, State)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-b border-[#E5DED4] focus:border-brand-terracotta bg-transparent py-2 outline-hidden text-brand-charcoal transition-colors font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-stone flex items-center gap-1.5">
              <Phone size={12} className="text-brand-clay" /> Phone Number (For Verification)
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 019-2834"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border-b border-[#E5DED4] focus:border-brand-terracotta bg-transparent py-2 outline-hidden text-brand-charcoal transition-colors font-medium"
            />
          </div>
        </div>

        {/* Discovery Radius & Age Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-brand-stone">
              <span>Search Radius</span>
              <span className="text-brand-terracotta font-semibold">{locationRadius} miles</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={locationRadius}
              onChange={(e) => setLocationRadius(parseInt(e.target.value))}
              className="w-full h-1 bg-[#E5DED4] rounded-lg appearance-none cursor-pointer accent-brand-terracotta"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-brand-stone">
              <span>Target Age Range</span>
              <span className="text-brand-terracotta font-semibold">{ageRangeMin} - {ageRangeMax}</span>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                min={18}
                max={99}
                value={ageRangeMin}
                onChange={(e) => setAgeRangeMin(Math.min(ageRangeMax - 1, parseInt(e.target.value) || 18))}
                className="w-16 text-center border-b border-[#E5DED4] bg-transparent py-1 text-sm outline-hidden"
              />
              <span className="text-brand-stone font-light">to</span>
              <input
                type="number"
                min={18}
                max={99}
                value={ageRangeMax}
                onChange={(e) => setAgeRangeMax(Math.max(ageRangeMin + 1, parseInt(e.target.value) || 99))}
                className="w-16 text-center border-b border-[#E5DED4] bg-transparent py-1 text-sm outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Beautiful Interactive Photo Upload Area */}
        <div className="space-y-4 pt-4">
          <label className="text-xs font-mono uppercase tracking-widest text-brand-stone block">
            Profile Photos (Choose 1 to 4)
          </label>
          
          {/* Chosen photos previews */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photos.map((pUrl, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E5DED4]">
                  <img
                    src={pUrl}
                    alt={`Upload preview ${idx}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1.5 right-1.5 bg-brand-charcoal/80 text-white rounded-full p-1 hover:bg-brand-terracotta transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 bg-brand-charcoal/80 text-brand-beige px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">
                    Slot {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Preset Choice or Custom Upload */}
          <div className="p-6 bg-[#FAF7F2] border border-dashed border-[#DCD3C7] rounded-2xl flex flex-col items-center">
            <p className="text-xs text-brand-stone font-mono uppercase tracking-wider mb-4">
              Quick Select beautiful portrait placeholders:
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 max-w-full justify-start md:justify-center">
              {AVATAR_PRESETS.map((pUrl, index) => {
                const isSelected = photos.includes(pUrl);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectPresetAvatar(pUrl)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      isSelected ? 'border-brand-terracotta scale-105 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={pUrl}
                      alt={`preset-${index}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-terracotta/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-white drop-shadow-sm" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-brand-stone my-2">
              <span className="w-10 h-px bg-[#DCD3C7]" />
              <span className="text-[10px] font-mono uppercase tracking-widest">or upload custom</span>
              <span className="w-10 h-px bg-[#DCD3C7]" />
            </div>

            <label className="cursor-pointer flex items-center gap-2 bg-brand-cream border border-[#E5DED4] px-4 py-2 rounded-xl text-xs font-semibold text-brand-stone hover:bg-brand-charcoal hover:text-brand-beige hover:border-brand-charcoal transition-colors">
              <Upload size={14} />
              Choose local file...
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            className="w-full py-4 bg-brand-charcoal text-brand-beige font-medium tracking-wide rounded-full text-base transition-all hover:bg-brand-terracotta hover:shadow-lg focus:outline-hidden flex items-center justify-center gap-2 group"
          >
            Create Profile & Continue <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
}
