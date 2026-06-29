import React from 'react';
import { Song } from '../types';
import { SongRow } from './SongRow';
import { BarChart3, TrendingUp, Sparkles, Award } from 'lucide-react';

interface ViewAnalyticsProps {
  songs: Song[];
  history: Song[];
  playlistsCount: number;
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const ViewAnalytics: React.FC<ViewAnalyticsProps> = ({
  songs,
  history,
  playlistsCount,
  onPlaySong,
  onLikeToggle,
  onContextMenu,
}) => {
  // Compute analytics metrics
  const genreCount: Record<string, number> = {};
  const artistCount: Record<string, number> = {};
  const trackPlays: Record<number, number> = {};

  history.forEach(s => {
    genreCount[s.genre] = (genreCount[s.genre] || 0) + 1;
    artistCount[s.artist] = (artistCount[s.artist] || 0) + 1;
    trackPlays[s.id] = (trackPlays[s.id] || 0) + 1;
  });

  const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
  const topArtist = Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0];

  const statCards = [
    { label: 'Top Genre', val: topGenre ? topGenre[0] : '—', icon: '⚡', bg: 'bg-c/5', border: 'border-c/15' },
    { label: 'Top Artist', val: topArtist ? topArtist[0] : '—', icon: '🎤', bg: 'bg-pi/5', border: 'border-pi/15' },
    { label: 'Liked Tracks', val: songs.filter(s => s.liked).length, icon: '❤️', bg: 'bg-y/5', border: 'border-y/15' },
    { label: 'Playlists', val: playlistsCount, icon: '📋', bg: 'bg-gr/5', border: 'border-gr/15' },
    { label: 'Tracks Heard', val: history.length, icon: '🕒', bg: 'bg-p/5', border: 'border-p/15' },
  ];

  // Static weekday chart values (Mock, representing a beautiful rhythm!)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyPlays = [12, 28, 18, 25, 42, 35, 21];
  const maxPlayCount = Math.max(...dailyPlays);

  // Top Tracks Leaderboard (actual played songs from history, sorted by plays desc)
  const topPlayedSongIds = Object.entries(trackPlays).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => Number(x[0]));
  const topPlayedSongs = topPlayedSongIds
    .map(id => songs.find(s => s.id === id))
    .filter((s): s is Song => !!s);

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((card, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${card.bg} ${card.border}`}>
            <div className="text-xl mb-1">{card.icon}</div>
            <div className="text-sm font-extrabold text-white font-outfit truncate">{card.val}</div>
            <div className="text-[10px] text-t3 uppercase font-bold tracking-wider mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 2. Double split charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Genre Breakdown Progress Bars */}
        <section className="bg-b2/20 border border-white/5 p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-t1 uppercase tracking-wider font-outfit flex items-center gap-1.5">
            <TrendingUp size={13} className="text-p2" /> Genre Breakdown
          </h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {Object.keys(genreCount).length > 0 ? (
              Object.entries(genreCount)
                .sort((a, b) => b[1] - a[1])
                .map(([g, n]) => {
                  const maxVal = Math.max(...Object.values(genreCount), 1);
                  return (
                    <div key={g} className="flex items-center gap-2.5">
                      <span className="w-16 text-[11px] text-t2 truncate">{g}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-p to-c rounded-full"
                          style={{ width: `${(n / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="w-5 text-right text-[11px] font-mono text-t3">{n}</span>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-12 text-t3 text-xs">Start playing music to generate genre analysis.</div>
            )}
          </div>
        </section>

        {/* Weekly activity bars */}
        <section className="bg-b2/20 border border-white/5 p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-t1 uppercase tracking-wider font-outfit flex items-center gap-1.5">
            <BarChart3 size={13} className="text-c" /> Weekly Activity Index
          </h3>
          <div className="flex items-end gap-3.5 h-[160px] pt-4 px-2">
            {dailyPlays.map((playsCount, i) => {
              const heightPct = Math.round((playsCount / maxPlayCount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-p to-c rounded-t-md cursor-pointer hover:opacity-85 transition-all shadow-lg shadow-p/5"
                    style={{ height: `${heightPct}%`, minHeight: '4px' }}
                    title={`${playsCount} tracks played`}
                  />
                  <span className="text-[10px] text-t3 font-medium">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Session Top Leaderboard */}
      <section className="space-y-4">
        <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit flex items-center gap-1.5">
          <Award size={14} className="text-y" /> Session Leaderboard (Top Heard Tracks)
        </h3>
        {topPlayedSongs.length > 0 ? (
          <div className="space-y-0.5 bg-b2/20 border border-white/5 p-4 rounded-3xl">
            {topPlayedSongs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                isPlaying={false}
                isCurrent={false}
                onPlay={(s) => onPlaySong(s, topPlayedSongs, i)}
                onLikeToggle={onLikeToggle}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-b2/10 rounded-3xl border border-white/5">
            <div className="text-4xl mb-3">🏆</div>
            <h5 className="text-xs font-bold text-t2">Leaderboard empty</h5>
            <p className="text-[11px] text-t3 max-w-[280px] mx-auto leading-relaxed mt-1">
              Tracks you play in this session will climb the ranks and rank here dynamically!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
