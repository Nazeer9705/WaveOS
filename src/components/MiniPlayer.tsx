import React, { useState } from 'react';
import { Song } from '../types';
import { Play, Pause, SkipForward, X, Music, Expand } from 'lucide-react';

interface MiniPlayerProps {
  visible: boolean;
  song: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onClose: () => void;
  onOpenFull: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  visible,
  song,
  isPlaying,
  onTogglePlay,
  onNext,
  onClose,
  onOpenFull,
}) => {
  if (!visible || !song) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[450] max-w-[280px] w-full bg-b3/95 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-8 duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative group shrink-0">
          <img
            src={song.cover}
            alt=""
            className={`w-10 h-10 rounded-lg object-cover ${isPlaying ? 'animate-pulse' : ''}`}
          />
          <button
            onClick={onOpenFull}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white rounded-lg transition-all cursor-pointer"
            title="Expand Full"
          >
            <Expand size={11} />
          </button>
        </div>
        <div className="min-w-0">
          <h4 className="text-[11.5px] font-bold text-white truncate leading-tight w-[120px]">
            {song.title}
          </h4>
          <p className="text-[10px] text-t3 truncate mt-0.5 w-[120px]">{song.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onTogglePlay}
          className="w-7 h-7 bg-white text-b0 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause size={10} fill="currentColor" className="text-b0" />
          ) : (
            <Play size={10} fill="currentColor" className="ml-0.5 text-b0" />
          )}
        </button>

        <button
          onClick={onNext}
          className="w-7 h-7 bg-white/5 hover:bg-white/10 text-t2 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
        >
          <SkipForward size={11} fill="currentColor" />
        </button>

        <button
          onClick={onClose}
          className="w-7 h-7 bg-white/5 hover:bg-white/10 text-t3 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
          title="Minimize"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
};
