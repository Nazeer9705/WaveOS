import React from 'react';
import { Song } from '../types';
import { Heart, Play } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (song: Song) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying,
  isCurrent,
  onPlay,
  onLikeToggle,
  onContextMenu,
}) => {
  const formatPlays = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.floor(num / 1000) + 'K';
    return num.toString();
  };

  return (
    <div
      onContextMenu={(e) => onContextMenu(e, song)}
      onClick={() => onPlay(song)}
      className={`group relative bg-b2 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-b3 hover:-translate-y-1 hover:shadow-2xl hover:border-white/10 ${
        isCurrent ? 'border-p/40 bg-p/5' : ''
      }`}
    >
      {/* Cover Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-b4">
        <img
          src={song.cover}
          alt={song.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with play button */}
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-200 shadow-lg text-b0">
            <Play size={18} fill="currentColor" className="ml-0.5 text-b0" />
          </div>
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(song.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/65 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
            song.liked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            size={13}
            fill={song.liked ? 'var(--color-pi)' : 'none'}
            stroke={song.liked ? 'var(--color-pi)' : 'currentColor'}
            className={song.liked ? 'text-pi animate-ping-once' : 'text-t2 hover:text-white'}
          />
        </button>

        {/* Equalizer Bars Overlay (visible when playing) */}
        {isCurrent && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/5">
            <div className={`w-[2.5px] bg-gradient-to-t from-p to-c rounded-sm h-[6px] ${isPlaying ? 'eq-bar-1' : ''}`} />
            <div className={`w-[2.5px] bg-gradient-to-t from-p to-c rounded-sm h-[12px] ${isPlaying ? 'eq-bar-2' : ''}`} />
            <div className={`w-[2.5px] bg-gradient-to-t from-p to-c rounded-sm h-[9px] ${isPlaying ? 'eq-bar-3' : ''}`} />
            <div className={`w-[2.5px] bg-gradient-to-t from-p to-c rounded-sm h-[15px] ${isPlaying ? 'eq-bar-4' : ''}`} />
            <div className={`w-[2.5px] bg-gradient-to-t from-p to-c rounded-sm h-[8px] ${isPlaying ? 'eq-bar-5' : ''}`} />
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3.5">
        <h4 className="font-bold text-sm text-t1 mb-0.5 truncate group-hover:text-p2 transition-colors">
          {song.title}
        </h4>
        <p className="text-xs text-t2 truncate mb-2">{song.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-t3 font-mono">
            {formatPlays(song.plays)} plays
          </span>
          <span className="text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/5 text-t3 group-hover:bg-white/10 group-hover:text-t2 transition-all">
            {song.genre}
          </span>
        </div>
      </div>
    </div>
  );
};
