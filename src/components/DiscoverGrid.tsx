/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match, User, MatchAction, Gender } from '../types';
import { SEEDED_PROFILES, SeededProfile } from '../data/profiles';
import { MapPin, Search, SlidersHorizontal, Sparkles, X, Heart, Eye } from 'lucide-react';

interface DiscoverGridProps {
  matches: Match[];
  onAction: (matchId: string, action: MatchAction) => void;
}

export default function DiscoverGrid({ matches, onAction }: DiscoverGridProps) {
  const [search, setSearch] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [matchAny, setMatchAny] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedProfile, setSelectedProfile] = useState<SeededProfile | null>(null);

  // Extract all distinct interest chips from seeded profiles
  const allInterestChips = Array.from(
    new Set(SEEDED_PROFILES.flatMap((p) => p.interestChips))
  );

  const toggleChipFilter = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  // Filter candidates: exclude those that have been actioned (not null)
  const availableMatches = matches.filter((m) => m.aAction === null);
  
  // Map matches to seed data
  const filteredCandidates = availableMatches
    .map((match) => {
      const profile = SEEDED_PROFILES.find((p) => p.id === match.userBId);
      return { match, profile };
    })
    .filter(({ profile }) => {
      if (!profile) return false;
      
      // Gender check
      if (selectedGender !== 'ALL' && profile.gender !== selectedGender) {
        return false;
      }

      // Search text check (name or bio or location)
      if (search.trim()) {
        const query = search.toLowerCase();
        const inName = profile.name.toLowerCase().includes(query);
        const inBio = profile.bio.toLowerCase().includes(query);
        const inLoc = profile.location.toLowerCase().includes(query);
        if (!inName && !inBio && !inLoc) return false;
      }

      // Chip filters check
      if (selectedChips.length > 0) {
        if (matchAny) {
          // At least one selected chip matches
          return selectedChips.some((c) => profile.interestChips.includes(c));
        } else {
          // All selected chips must match
          return selectedChips.every((c) => profile.interestChips.includes(c));
        }
      }

      return true;
    });

  const handleConnectFromDiscover = (matchId: string) => {
    onAction(matchId, MatchAction.LIKE);
    setSelectedProfile(null);
  };

  const handlePassFromDiscover = (matchId: string) => {
    onAction(matchId, MatchAction.PASS);
    setSelectedProfile(null);
  };

  return (
    <div id="discover-grid-container" className="space-y-8 text-left">
      {/* Search and Filters panel */}
      <div className="bg-brand-cream border border-[#F0E8DC] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-3.5 text-brand-stone" />
            <input
              type="text"
              placeholder="Search by name, interests, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-cream border border-[#E5DED4] rounded-xl text-sm focus:border-brand-charcoal focus:outline-hidden transition-colors font-medium text-brand-charcoal"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', Gender.WOMAN, Gender.MAN, Gender.NONBINARY].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all ${
                  selectedGender === g
                    ? 'bg-brand-charcoal border-brand-charcoal text-brand-beige font-semibold'
                    : 'bg-transparent border-[#E5DED4] text-brand-stone hover:bg-[#F2ECE4]'
                }`}
              >
                {g === 'ALL' ? 'All Genders' : g.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Chip Filtering area */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-brand-stone">
            <span className="flex items-center gap-1.5"><SlidersHorizontal size={12} /> Filter by traits</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">Match Mode:</span>
              <button
                onClick={() => setMatchAny(true)}
                className={`px-2 py-1 rounded-md text-[10px] ${matchAny ? 'bg-brand-clay text-white font-bold' : 'bg-transparent border border-[#E5DED4]'}`}
              >
                Any
              </button>
              <button
                onClick={() => setMatchAny(false)}
                className={`px-2 py-1 rounded-md text-[10px] ${!matchAny ? 'bg-brand-clay text-white font-bold' : 'bg-transparent border border-[#E5DED4]'}`}
              >
                All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-transparent rounded-lg hover:border-[#E5DED4] transition-all">
            {allInterestChips.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => toggleChipFilter(chip)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                    isSelected
                      ? 'bg-brand-terracotta border-brand-terracotta text-white shadow-xs'
                      : 'bg-transparent border-[#E5DED4] text-brand-stone hover:border-brand-stone'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-16 bg-brand-cream border border-[#F0E8DC] rounded-3xl space-y-4">
          <p className="text-brand-stone text-base">No matches found with current discovery filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedChips([]);
              setSelectedGender('ALL');
            }}
            className="text-xs font-mono uppercase tracking-widest text-brand-clay font-bold underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCandidates.map(({ match, profile }) => {
            if (!profile) return null;
            return (
              <div
                key={match.id}
                className="bg-brand-cream border border-[#F0E8DC] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo frame */}
                <div className="relative aspect-square w-full bg-[#E5DED4] overflow-hidden">
                  <img
                    src={profile.photos[0]?.url}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Compatibility overlay */}
                  <div className="absolute top-3 right-3 bg-brand-charcoal/90 text-brand-beige px-3 py-1.5 rounded-full text-xs font-semibold border border-brand-beige">
                    <span className="text-[9px] font-mono uppercase text-brand-clay mr-1">Match</span>
                    <span className="text-sm font-display font-bold text-brand-terracotta">{match.displayScore}%</span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-display font-semibold text-brand-charcoal">
                      {profile.name}, <span className="font-light italic text-brand-stone">{profile.age}</span>
                    </h4>
                    <p className="text-xs font-mono text-brand-stone flex items-center gap-0.5">
                      <MapPin size={10} className="text-brand-clay" /> {profile.location}
                    </p>
                    <p className="text-xs text-brand-stone leading-relaxed line-clamp-2 pt-1 font-light">
                      {profile.bio}
                    </p>
                  </div>

                  {/* Actions bar */}
                  <div className="flex gap-2 pt-2 border-t border-[#F5EFE6]">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="flex-1 py-2 bg-brand-cream border border-[#E5DED4] text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-beige hover:border-brand-charcoal transition-colors rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1 font-semibold"
                    >
                      <Eye size={12} /> Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (() => {
        const candidateMatch = matches.find((m) => m.userBId === selectedProfile.id);
        if (!candidateMatch) return null;

        return (
          <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up my-8 text-left">
              {/* Image and Header */}
              <div className="relative aspect-[4/3] w-full bg-brand-charcoal">
                <img
                  src={selectedProfile.photos[0]?.url}
                  alt={selectedProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 left-4 bg-brand-charcoal/80 text-white rounded-full p-2 hover:bg-brand-terracotta transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="absolute top-4 right-4 bg-brand-charcoal border border-brand-beige text-brand-beige px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Match score</span>
                  <span className="text-xl font-display font-bold text-brand-terracotta">{candidateMatch.displayScore}%</span>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {candidateMatch.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-brand-cream/95 backdrop-blur-xs text-brand-charcoal text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#E5DED4] shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-6">
                <div className="border-b border-[#F0E8DC] pb-4">
                  <h3 className="text-2xl font-display font-semibold text-brand-charcoal">
                    {selectedProfile.name}, <span className="font-light italic text-brand-stone">{selectedProfile.age}</span>
                  </h3>
                  <p className="text-xs font-mono text-brand-stone flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-brand-clay" /> {selectedProfile.location}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Bio</h5>
                  <p className="text-sm text-brand-charcoal leading-relaxed font-light">{selectedProfile.bio}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Interests</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.interestChips.map((chip, i) => (
                      <span
                        key={i}
                        className="bg-[#FAF7F2] text-brand-stone text-xs font-medium px-2.5 py-1 rounded-md border border-[#E5DED4]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#F0E8DC] pt-4">
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedProfile.appearanceThisIsMe.map((chip, i) => (
                        <span key={i} className="bg-brand-charcoal text-brand-beige text-[10px] font-mono px-2 py-0.5 rounded-full">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-clay font-semibold">Drawn To</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedProfile.appearanceDrawnTo.map((chip, i) => (
                        <span key={i} className="bg-transparent border border-brand-clay text-brand-clay text-[10px] font-mono px-2 py-0.5 rounded-full">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connect / Pass actions directly in details */}
                <div className="border-t border-[#F0E8DC] pt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => handlePassFromDiscover(candidateMatch.id)}
                    className="flex-1 py-3 bg-brand-cream border border-[#E5DED4] text-brand-stone hover:bg-brand-charcoal hover:text-beige rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={14} /> Pass
                  </button>

                  <button
                    onClick={() => handleConnectFromDiscover(candidateMatch.id)}
                    className="flex-1 py-3 bg-brand-charcoal text-brand-beige hover:bg-brand-terracotta rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Heart size={14} className="fill-brand-beige" /> Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
