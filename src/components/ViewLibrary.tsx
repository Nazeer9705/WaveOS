import React, { useState } from 'react';
import { Song, Playlist } from '../types';
import { SongRow } from './SongRow';
import { Plus, ListMusic, Heart, FolderHeart, Eye, EyeOff } from 'lucide-react';

interface ViewLibraryProps {
  songs: Song[];
  playlists: Playlist[];
  onCreatePlaylist: (name: string, desc: string, pub: boolean) => void;
  onPlayPlaylist: (id: number) => void;
  onPlaySong: (song: Song) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export const ViewLibrary: React.FC<ViewLibraryProps> = ({
  songs,
  playlists,
  onCreatePlaylist,
  onPlayPlaylist,
  onPlaySong,
  onLikeToggle,
  onContextMenu,
  onToast,
  currentSong,
  isPlaying,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [plName, setPlName] = useState('');
  const [plDesc, setPlDesc] = useState('');
  const [plPub, setPlPub] = useState(true);

  const [expandedLiked, setExpandedLiked] = useState(false);

  const likedSongs = songs.filter(s => s.liked);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plName.trim()) {
      onToast('Playlist name is required!', 'e');
      return;
    }

    onCreatePlaylist(plName.trim(), plDesc.trim(), plPub);
    onToast(`Playlist "${plName}" created!`, 's');

    // Reset Form
    setPlName('');
    setPlDesc('');
    setPlPub(true);
    setShowCreateModal(false);
  };

  const handlePlayLiked = () => {
    if (likedSongs.length === 0) {
      onToast('No liked songs yet! Click the heart on any track.', 'i');
      return;
    }
    onPlaySong(likedSongs[0], likedSongs, 0);
    onToast(`❤️ Playing ${likedSongs.length} Liked Songs`, 's');
  };

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* View Header with Action */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">Your Music Library</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-p to-c hover:opacity-90 text-white text-xs font-bold px-5 py-2.5 rounded-full font-outfit transition-all cursor-pointer"
        >
          <Plus size={14} /> New Playlist
        </button>
      </div>

      {/* Liked Songs Quick Card */}
      <div
        onClick={() => setExpandedLiked(!expandedLiked)}
        className="group relative bg-gradient-to-r from-p/10 via-pi/5 to-b2 border border-white/10 p-6 rounded-3xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-all select-none overflow-hidden"
      >
        <div className="absolute top-[-30px] right-[20px] w-48 h-48 rounded-full bg-pi/5 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pi to-p flex items-center justify-center text-2xl shadow-xl shadow-pi/25 shrink-0 transition-transform group-hover:scale-103 duration-300">
            ❤️
          </div>
          <div>
            <h4 className="text-[15px] font-extrabold text-t1 font-outfit">Loved Tracks Collection</h4>
            <p className="text-[11.5px] text-t3 font-bold mt-1 uppercase tracking-wide">
              {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayLiked();
            }}
            className="w-11 h-11 bg-gradient-to-r from-pi to-p text-white hover:scale-105 active:scale-95 flex items-center justify-center rounded-full shadow-lg shadow-pi/20 shrink-0 transition-all cursor-pointer text-sm"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Liked Songs Expanded Box */}
      {expandedLiked && (
        <div className="space-y-4 bg-b2/15 border border-white/5 rounded-3xl p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-xs font-bold text-t1 font-outfit flex items-center gap-1.5"><Heart size={12} className="text-pi" /> Liked Tracks List</h4>
            <button onClick={() => setExpandedLiked(false)} className="text-xs text-t3 hover:text-white">Hide ✕</button>
          </div>
          {likedSongs.length > 0 ? (
            <div className="space-y-0.5">
              {likedSongs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  isPlaying={isPlaying}
                  isCurrent={currentSong?.id === song.id}
                  onPlay={(s) => onPlaySong(s, likedSongs, likedSongs.indexOf(s))}
                  onLikeToggle={onLikeToggle}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-t3 text-xs">No liked songs yet! Click the heart on any track across the app.</div>
          )}
        </div>
      )}

      {/* Custom Playlists list grid */}
      <section className="space-y-4">
        <h4 className="text-xs font-bold text-t3 uppercase tracking-wider font-outfit">Your Playlists</h4>
        
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((pl) => {
              // Assemble a 2x2 collage of artwork
              const plSongs = pl.songs
                .map(id => songs.find(s => s.id === id))
                .filter((s): s is Song => !!s);
              
              const collageImages = plSongs.slice(0, 4).map(s => s.cover);
              while (collageImages.length < 4) {
                collageImages.push('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop&q=50');
              }

              return (
                <div
                  key={pl.id}
                  onClick={() => onPlayPlaylist(pl.id)}
                  className="group relative bg-b2 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Grid Collage Artwork */}
                  <div className="relative aspect-square grid grid-cols-2 grid-rows-2 overflow-hidden bg-b4">
                    {collageImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover border border-b1/20"
                      />
                    ))}
                    
                    {/* Play Hover overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white text-b0 rounded-full flex items-center justify-center text-sm font-extrabold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        ▶
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3">
                    <h5 className="font-bold text-xs text-t1 truncate group-hover:text-p2 transition-colors">
                      {pl.name}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-t3 font-medium mt-1">
                      <span>{pl.songs.length} tracks</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        {pl.pub ? <Eye size={10} /> : <EyeOff size={10} />}
                        {pl.pub ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-b2/10 rounded-3xl border border-white/5">
            <div className="text-4xl mb-3">📚</div>
            <h5 className="text-sm font-bold text-t1 mb-1">No playlists created yet</h5>
            <p className="text-xs text-t3">Click "+ New Playlist" to start curating your dream vibes.</p>
          </div>
        )}
      </section>

      {/* CREATE PLAYLIST MODAL OVERLAY */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          <div className="bg-b3 border border-white/10 rounded-3xl p-7 max-w-[400px] w-full shadow-2xl">
            <h3 className="text-xl font-black text-t1 mb-1 font-outfit">New Playlist 🎵</h3>
            <p className="text-xs text-t2 mb-6">Build your perfect music collection.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Name *</label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  placeholder="e.g. Chill Rainy Sundays"
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-t1 placeholder-t3/50 focus:border-p/50 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Description</label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Poetic soundscapes to relax with"
                  value={plDesc}
                  onChange={(e) => setPlDesc(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-t1 placeholder-t3/50 focus:border-p/50 focus:outline-none transition-all"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-t2 py-2">
                <input
                  type="checkbox"
                  checked={plPub}
                  onChange={(e) => setPlPub(e.target.checked)}
                  className="accent-p rounded w-4 h-4 cursor-pointer"
                />
                Make public in profile
              </label>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-t2 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-p to-c text-white font-extrabold text-xs rounded-xl font-outfit hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
