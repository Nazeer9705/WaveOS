import React from 'react';
import { Song } from '../types';
import { Heart } from 'lucide-react';

interface SongRowProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (song: Song) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onContextMenu={(e) => onContextMenu(e, song)}
      onClick={() => onPlay(song)}
      className={`group flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200 select-none ${
        isCurrent ? 'bg-p/10' : ''
      }`}
    >
      {/* Index Number or EQ */}
      <div className="w-7 text-center text-xs text-t3 font-mono flex-shrink-0 flex items-center justify-center">
        {isCurrent ? (
          <div className="flex items-end gap-0.5 h-[14px]">
            <div className={`w-[2px] bg-p2 rounded-sm h-[4px] ${isPlaying ? 'eq-bar-1' : ''}`} />
            <div className={`w-[2px] bg-p2 rounded-sm h-[10px] ${isPlaying ? 'eq-bar-2' : ''}`} />
            <div className={`w-[2px] bg-p2 rounded-sm h-[7px] ${isPlaying ? 'eq-bar-3' : ''}`} />
            <div className={`w-[2px] bg-p2 rounded-sm h-[12px] ${isPlaying ? 'eq-bar-4' : ''}`} />
          </div>
        ) : (
          index + 1
        )}
      </div>

      {/* Artwork */}
      <img
        src={song.cover}
        alt=""
        loading="lazy"
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-b4 border border-white/5"
      />

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold truncate ${isCurrent ? 'text-p2' : 'text-t1'}`}>
          {song.title}
        </div>
        <div className="text-[11.5px] text-t2 truncate mt-0.5">
          {song.artist} <span className="text-t3/80 font-medium">· {song.album || 'Unknown Album'}</span>
        </div>
      </div>

      {/* Play count */}
      <div className="w-16 text-right text-xs text-t3 font-mono hidden sm:block">
        {formatPlays(song.plays)}
      </div>

      {/* Duration */}
      <div className="w-12 text-right text-xs text-t3 font-mono">
        {formatTime(song.dur)}
      </div>

      {/* Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle(song.id);
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-all ${
          song.liked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart
          size={14}
          fill={song.liked ? 'var(--color-pi)' : 'none'}
          stroke={song.liked ? 'var(--color-pi)' : 'currentColor'}
          className={song.liked ? 'text-pi' : 'text-t3 hover:text-white'}
        />
      </button>
    </div>
  );
};
