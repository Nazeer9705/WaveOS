import React from 'react';
import { Song } from '../types';
import { LYRICS } from '../data';

interface ViewLyricsProps {
  currentSong: Song | null;
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
}

export const ViewLyrics: React.FC<ViewLyricsProps> = ({ currentSong, onToast }) => {
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(0);

  // Sync state resets on track changes
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [currentSong]);

  if (!currentSong) {
    return (
      <div className="view-container max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <h4 className="text-sm font-bold text-t1 mb-1">No song active</h4>
        <p className="text-xs text-t3">Play a song to view real-time synchronized lyrics.</p>
      </div>
    );
  }

  const lines = LYRICS[currentSong.id];

  const handleLineClick = (idx: number) => {
    setHighlightedIndex(idx);
    onToast(`🎤 Synced lyrics marker to verse ${idx + 1}`, 'i');
  };

  return (
    <div className="view-container max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-5 p-5 bg-b2/40 border border-white/5 rounded-3xl">
        <img
          src={currentSong.cover}
          alt=""
          className="w-16 h-16 rounded-2xl object-cover shadow-2xl shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-lg font-black text-t1 truncate leading-tight font-outfit">{currentSong.title}</h4>
          <p className="text-xs text-t2 truncate mt-0.5">{currentSong.artist}</p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[10px] font-bold text-p2 bg-p/10 px-2 py-0.5 rounded-full border border-p/20">
              {currentSong.genre}
            </span>
            <span className="text-[10px] font-bold text-c bg-c/10 px-2 py-0.5 rounded-full border border-c/20 truncate max-w-[140px]">
              {currentSong.album}
            </span>
          </div>
        </div>
      </div>

      {/* Lyrics lines */}
      <div className="bg-b2/10 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-1 max-h-[500px] overflow-y-auto font-display scroll-smooth">
        {lines && lines.length > 0 ? (
          lines.map((line, i) => {
            const isActive = highlightedIndex === i;
            return (
              <div key={i}>
                {line.trim() === '' ? (
                  <div className="h-6" />
                ) : (
                  <button
                    onClick={() => handleLineClick(i)}
                    className={`w-full text-left py-1 text-sm sm:text-base md:text-lg font-semibold tracking-tight transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'text-white scale-102 font-extrabold translate-x-1 filter drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]'
                        : 'text-t3 hover:text-t2'
                    }`}
                  >
                    {line}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="text-3xl mb-3">🎵</div>
            <h4 className="text-xs font-bold text-t2">Instrumental Vibe</h4>
            <p className="text-[11px] text-t3 mt-1">Lyrics aren't registered for this track yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
