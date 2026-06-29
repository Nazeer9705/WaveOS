import React from 'react';
import { Song } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  song: Song | null;
  onClose: () => void;
  onPlay: (song: Song) => void;
  onPlayNext: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onLikeToggle: (song: Song) => void;
  onShare: (song: Song) => void;
  onLyrics: (song: Song) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  visible,
  song,
  onClose,
  onPlay,
  onPlayNext,
  onAddToQueue,
  onLikeToggle,
  onShare,
  onLyrics,
}) => {
  if (!visible || !song) return null;

  // Ensure menu doesn't overflow screen boundaries
  const adjustedX = Math.min(x, window.innerWidth - 210);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  return (
    <>
      {/* Background click interceptor */}
      <div 
        className="fixed inset-0 z-50 cursor-default" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
      <div
        className="fixed z-50 bg-b4 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
        style={{ left: adjustedX, top: adjustedY }}
      >
        <div className="px-3 py-2 border-b border-white/5 text-xs text-t3 font-bold uppercase tracking-wider">
          Track Options
        </div>
        <button
          onClick={() => { onPlay(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>▶</span> Play Now
        </button>
        <button
          onClick={() => { onPlayNext(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>⏭</span> Play Next
        </button>
        <button
          onClick={() => { onAddToQueue(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>📋</span> Add to Queue
        </button>
        <div className="h-[1px] bg-white/5 my-1" />
        <button
          onClick={() => { onLikeToggle(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>❤️</span> {song.liked ? 'Unlike Song' : 'Like Song'}
        </button>
        <button
          onClick={() => { onShare(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>🔗</span> Share Track
        </button>
        <button
          onClick={() => { onLyrics(song); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t2 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>🎤</span> View Lyrics
        </button>
        <div className="h-[1px] bg-white/5 my-1" />
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-t3 hover:bg-white/5 hover:text-t1 transition-all"
        >
          <span>✕</span> Close
        </button>
      </div>
    </>
  );
};
