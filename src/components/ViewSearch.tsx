import React, { useState } from 'react';
import { Song } from '../types';
import { SongRow } from './SongRow';

interface ViewSearchProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const ViewSearch: React.FC<ViewSearchProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onLikeToggle,
  onContextMenu,
}) => {
  const [query, setQuery] = useState('');

  const genres: string[] = Array.from(new Set(songs.map(s => s.genre))) as string[];

  // Specific visual styles/colors/icons for genre browsers
  const genreMetadata: Record<string, { bg: string; border: string; emoji: string }> = {
    Electronic: { bg: 'bg-p/10', border: 'border-p/20', emoji: '⚡' },
    Ambient: { bg: 'bg-c/10', border: 'border-c/20', emoji: '🌊' },
    Techno: { bg: 'bg-pi/10', border: 'border-pi/20', emoji: '🔊' },
    Chillout: { bg: 'bg-y/10', border: 'border-y/20', emoji: '🌙' },
    Indie: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', emoji: '🎸' },
    Jazz: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', emoji: '🎷' },
    Folk: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', emoji: '🪕' },
    'Dream Pop': { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', emoji: '✨' },
    Synthpop: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', emoji: '🤖' },
    Alternative: { bg: 'bg-red-500/10', border: 'border-red-500/20', emoji: '🎭' },
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleGenreClick = (g: string) => {
    setQuery(g);
  };

  // Filters logic
  const filteredSongs = songs.filter(s => {
    const q = query.toLowerCase().trim();
    if (!q) return false;
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );
  });

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search songs, artists, albums, or genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-b2 border border-white/10 rounded-2xl py-4.5 pl-6 pr-12 text-sm text-t1 placeholder-t3/50 focus:border-p/50 focus:outline-none transition-all shadow-lg"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-t2 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {query ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-t3 font-medium">
            Showing {filteredSongs.length} results for <strong className="text-t2">"{query}"</strong>
          </p>
          {filteredSongs.length > 0 ? (
            <div className="space-y-1 bg-b2/20 border border-white/5 p-4 rounded-3xl">
              {filteredSongs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  isPlaying={isPlaying}
                  isCurrent={currentSong?.id === song.id}
                  onPlay={(s) => onPlaySong(s, filteredSongs, filteredSongs.indexOf(s))}
                  onLikeToggle={onLikeToggle}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-b2/10 rounded-3xl border border-white/5">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-sm font-bold text-t1 mb-1">No tracks match your query</h4>
              <p className="text-xs text-t3">Try checking your spelling or search another keyword</p>
            </div>
          )}
        </div>
      ) : (
        /* GENRE BROWSER GRID */
        <div className="space-y-4 animate-in fade-in duration-300">
          <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">Browse Genres</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {genres.map((g) => {
              const meta = genreMetadata[g] || { bg: 'bg-white/5', border: 'border-white/10', emoji: '🎵' };
              const count = songs.filter(s => s.genre === g).length;
              return (
                <div
                  key={g}
                  onClick={() => handleGenreClick(g)}
                  className={`rounded-2xl p-5 border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-b4 ${meta.bg} ${meta.border}`}
                >
                  <div className="text-3xl mb-3">{meta.emoji}</div>
                  <h4 className="text-[13.5px] font-extrabold text-t1 font-outfit">{g}</h4>
                  <p className="text-[10.5px] text-t3 mt-1 font-medium">{count} songs</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
