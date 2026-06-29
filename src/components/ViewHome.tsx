import React from 'react';
import { Song, Friend } from '../types';
import { HeroSection } from './HeroSection';
import { SongCard } from './SongCard';
import { SongRow } from './SongRow';
import { Play, Sparkles } from 'lucide-react';

interface ViewHomeProps {
  songs: Song[];
  friends: Friend[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  onLikeToggle: (id: number) => void;
  onNavigate: (view: string) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
}

export const ViewHome: React.FC<ViewHomeProps> = ({
  songs,
  friends,
  currentSong,
  isPlaying,
  onPlaySong,
  onLikeToggle,
  onNavigate,
  onContextMenu,
}) => {
  // Sort songs by plays desc to find the single most popular song
  const topSong = [...songs].sort((a, b) => b.plays - a.plays)[0];
  const trendingSongs = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);
  const freshSongs = songs.slice(0, 10);
  
  // Recommend songs based on genres of liked songs
  const likedGenres = new Set(songs.filter(s => s.liked).map(s => s.genre));
  let recommendedSongs: Song[] = [];
  if (likedGenres.size > 0) {
    recommendedSongs = songs
      .filter(s => !s.liked)
      .map(s => ({ s, score: (likedGenres.has(s.genre) ? 3 : 0) + Math.random() * 2 }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.s)
      .slice(0, 8);
  } else {
    // Shuffled default
    recommendedSongs = [...songs].sort(() => Math.random() - 0.5).slice(0, 8);
  }

  const recentlyAddedSongs = [...songs].sort((a, b) => b.id - a.id).slice(0, 10);

  const handlePlayMix = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    onPlaySong(shuffled[0], shuffled, 0);
  };

  const formatPlays = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.floor(num / 1000) + 'K';
    return num.toString();
  };

  // Greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning ☀️';
    if (hours < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-12">
      {/* 1. Hero Widget */}
      <HeroSection
        greeting={getGreeting()}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayMix={handlePlayMix}
        onNavigate={onNavigate}
      />

      {/* 2. Most Played Featured Row Banner */}
      {topSong && (
        <section className="space-y-4">
          <div className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">Featured Release</div>
          <div 
            onClick={() => onPlaySong(topSong, songs, songs.indexOf(topSong))}
            className="group relative rounded-3xl overflow-hidden h-[180px] border border-white/10 shadow-xl cursor-pointer"
          >
            <img
              src={topSong.cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-b0/95 via-b0/80 to-transparent" />
            <div className="absolute inset-0 p-6 flex items-center gap-6">
              <img
                src={topSong.cover}
                alt=""
                className="w-24 h-24 rounded-2xl object-cover shadow-2xl shrink-0 border border-white/10 group-hover:scale-103 transition-transform"
              />
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-y tracking-widest bg-y/10 px-2 py-0.5 rounded-full border border-y/20">
                  ⚡ Weekly Leader
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white truncate font-outfit mt-2">
                  {topSong.title}
                </h3>
                <p className="text-xs text-t2 truncate">{topSong.artist} · <span className="opacity-80">{topSong.album}</span></p>
                
                <button className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-p to-c text-white font-bold text-xs rounded-full hover:scale-105 active:scale-95 transition-all">
                  <Play size={10} fill="currentColor" /> Play Now · {formatPlays(topSong.plays)} plays
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Trending Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-t1 font-outfit tracking-tight">🔥 Trending Now</h3>
          <button onClick={() => onNavigate('search')} className="text-xs font-bold text-p hover:opacity-85 cursor-pointer">See all →</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {trendingSongs.map((song) => (
            <div key={song.id} className="w-[155px] shrink-0 snap-start">
              <SongCard
                song={song}
                isPlaying={isPlaying}
                isCurrent={currentSong?.id === song.id}
                onPlay={(s) => onPlaySong(s, songs, songs.indexOf(s))}
                onLikeToggle={onLikeToggle}
                onContextMenu={onContextMenu}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Fresh Picks dense row list */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-t1 font-outfit tracking-tight">🎵 Fresh Picks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 bg-b2/20 border border-white/5 p-4 rounded-3xl">
          {freshSongs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              isPlaying={isPlaying}
              isCurrent={currentSong?.id === song.id}
              onPlay={(s) => onPlaySong(s, songs, songs.indexOf(s))}
              onLikeToggle={onLikeToggle}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      </section>

      {/* 5. Recommended & Recently Added Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended column */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-t1 font-outfit tracking-tight flex items-center gap-1.5">
            <Sparkles size={16} className="text-p2" /> Recommended For You
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
            {recommendedSongs.slice(0, 4).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                isCurrent={currentSong?.id === song.id}
                onPlay={(s) => onPlaySong(s, songs, songs.indexOf(s))}
                onLikeToggle={onLikeToggle}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </section>

        {/* Recently Added column */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-t1 font-outfit tracking-tight">🆕 Recently Added</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
            {recentlyAddedSongs.slice(0, 4).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                isCurrent={currentSong?.id === song.id}
                onPlay={(s) => onPlaySong(s, songs, songs.indexOf(s))}
                onLikeToggle={onLikeToggle}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 6. Friends listening panel */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-t1 font-outfit tracking-tight">👥 Friends Activity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {friends.map((f, i) => (
            <div 
              key={i}
              className="bg-b2/40 border border-white/5 rounded-2xl p-4 text-center hover:border-white/10 transition-all select-none"
            >
              <div className="relative w-12 h-12 mx-auto mb-3.5">
                <img
                  src={f.av}
                  alt=""
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover border border-white/10"
                />
                {f.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gr border-2 border-b0 animate-pulse" />
                )}
              </div>
              <h5 className="text-[12.5px] font-bold text-t1 font-outfit leading-none truncate">{f.name}</h5>
              <p className="text-[10.5px] text-t2 truncate mt-1 leading-none">{f.song}</p>
              <span className="text-[8.5px] text-t3 uppercase font-bold tracking-wide mt-1 block truncate">
                {f.online ? 'Listening Now' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
