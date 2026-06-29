import React from 'react';
import { Song } from '../types';
import { SongRow } from './SongRow';
import { Calendar, Heart, Play, FolderHeart, Award } from 'lucide-react';

interface ViewProfileProps {
  songs: Song[];
  history: Song[];
  playlistsCount: number;
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const ViewProfile: React.FC<ViewProfileProps> = ({
  songs,
  history,
  playlistsCount,
  onPlaySong,
  onLikeToggle,
  onContextMenu,
}) => {
  const likedSongs = songs.filter(s => s.liked);
  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0);

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-br from-b2 via-b2 to-b4 border border-white/5 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=180&fit=crop&crop=face"
          alt=""
          className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl border-2 border-p/40 object-cover shadow-2xl shrink-0 bg-b5"
        />
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="text-xl sm:text-2xl font-black text-t1 font-outfit mb-1 tracking-tight">Alex Rivera</div>
          <div className="text-xs font-bold text-y flex items-center justify-center md:justify-start gap-1 font-outfit">
            <span>⭐</span> Pro Ultra Member
          </div>

          {/* Metrics grids */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3.5 bg-p/5 border border-p/15 rounded-2xl">
              <div className="text-xl mb-1 flex justify-center md:justify-start">❤️</div>
              <div className="text-base font-extrabold text-t1 font-outfit mt-1">{likedSongs.length}</div>
              <div className="text-[10px] text-t3 uppercase font-bold tracking-wider mt-0.5">Liked Tracks</div>
            </div>
            <div className="p-3.5 bg-c/5 border border-c/15 rounded-2xl">
              <div className="text-xl mb-1 flex justify-center md:justify-start">▶</div>
              <div className="text-base font-extrabold text-t1 font-outfit mt-1">{history.length}</div>
              <div className="text-[10px] text-t3 uppercase font-bold tracking-wider mt-0.5">Heard Recents</div>
            </div>
            <div className="p-3.5 bg-y/5 border border-y/15 rounded-2xl">
              <div className="text-xl mb-1 flex justify-center md:justify-start">📋</div>
              <div className="text-base font-extrabold text-t1 font-outfit mt-1">{playlistsCount}</div>
              <div className="text-[10px] text-t3 uppercase font-bold tracking-wider mt-0.5">Playlists</div>
            </div>
            <div className="p-3.5 bg-gr/5 border border-gr/15 rounded-2xl">
              <div className="text-xl mb-1 flex justify-center md:justify-start">🔥</div>
              <div className="text-base font-extrabold text-t1 font-outfit mt-1">1 Day</div>
              <div className="text-[10px] text-t3 uppercase font-bold tracking-wider mt-0.5">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Listening History Box */}
      <section className="space-y-4">
        <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">🕒 Recently Played Tracks</h3>
        {history.length > 0 ? (
          <div className="space-y-0.5 bg-b2/20 border border-white/5 p-4 rounded-3xl">
            {history.slice(0, 20).map((song, i) => (
              <SongRow
                key={`${song.id}-hist-${i}`}
                song={song}
                index={i}
                isPlaying={false}
                isCurrent={false}
                onPlay={(s) => onPlaySong(s, history, i)}
                onLikeToggle={onLikeToggle}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-b2/10 rounded-3xl border border-white/5">
            <div className="text-4xl mb-3">🕒</div>
            <h5 className="text-sm font-bold text-t1 mb-1">No listening history</h5>
            <p className="text-xs text-t3 max-w-[280px] mx-auto leading-relaxed mt-1">
              Tracks you play will automatically appear here to rebuild your listening history.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
