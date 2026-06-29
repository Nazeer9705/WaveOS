import React from 'react';
import { Play } from 'lucide-react';
import { Song } from '../types';

interface HeroSectionProps {
  greeting: string;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayMix: () => void;
  onNavigate: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  greeting,
  currentSong,
  isPlaying,
  onPlayMix,
  onNavigate,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden px-8 py-10 md:py-12 border border-p/20 bg-gradient-to-br from-p/20 via-c/10 to-pi/5 mb-8 shadow-2xl">
      {/* Dynamic Animated Glow Orbs */}
      <div className="absolute top-[-30px] right-[40px] w-64 h-64 rounded-full bg-p/20 blur-[60px] pointer-events-none animate-orb1" />
      <div className="absolute bottom-[-40px] left-[60px] w-48 h-48 rounded-full bg-c/15 blur-[55px] pointer-events-none animate-orb2" />
      <div className="absolute top-[20px] right-[200px] w-32 h-32 rounded-full bg-pi/15 blur-[45px] pointer-events-none animate-orb1 animation-delay-2000" />

      {/* Main Content */}
      <div className="relative z-10 max-w-[480px]">
        <div className="text-[10px] font-black tracking-widest text-p2 uppercase mb-2 font-outfit">
          {greeting}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.08] mb-3 font-outfit tracking-tight">
          Your Sound,<br />
          <span className="bg-gradient-to-r from-p to-c bg-clip-text text-transparent">Elevated.</span>
        </h2>
        <p className="text-xs sm:text-sm text-t2 leading-relaxed mb-6 font-display">
          Discover hand-crafted playlists, premium client synthesizers, interactive audio controls, and lyrics synchronization. No logins. No trackers. Just pure music.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onPlayMix}
            className="flex items-center gap-2 bg-white text-b0 px-6 py-3 rounded-full text-xs font-extrabold font-outfit shadow-lg shadow-black/25 hover:scale-104 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={14} fill="currentColor" /> Play Mix
          </button>
          <button
            onClick={() => onNavigate('mood')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            🎭 AI Mood
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-t2 border border-white/5 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            🔍 Search Catalog
          </button>
        </div>
      </div>

      {/* Hero Now Playing Floating Widget (Hidden on mobile) */}
      {currentSong && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl max-w-[260px] animate-in fade-in zoom-in-95 duration-300">
          <img
            src={currentSong.cover}
            alt=""
            className={`w-14 h-14 rounded-xl object-cover shadow-lg shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}
          />
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase text-p2 tracking-widest leading-none mb-1">
              Active Vibe
            </div>
            <h4 className="text-xs font-extrabold text-white truncate w-[140px] leading-tight">
              {currentSong.title}
            </h4>
            <p className="text-[11px] text-t2 truncate w-[140px] mt-0.5">
              {currentSong.artist}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
