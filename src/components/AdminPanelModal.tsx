import React, { useState, useRef } from 'react';
import { Song } from '../types';
import { Trash2, Play, Plus, BarChart3, ListMusic, Database, Image, Upload, Music } from 'lucide-react';

interface AdminPanelModalProps {
  visible: boolean;
  onClose: () => void;
  songs: Song[];
  onAddSong: (song: Omit<Song, 'id'>, audioFile?: File | Blob) => void;
  onRemoveSong: (id: number) => void;
  onPlaySong: (song: Song) => void;
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  visible,
  onClose,
  songs,
  onAddSong,
  onRemoveSong,
  onPlaySong,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'stats'>('add');

  // Add Song Form states
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState<number>(200);
  const [plays, setPlays] = useState<number>(15000);
  const [cover, setCover] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manage Tab Search filters
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  if (!visible) return null;

  // Unsplash Preset Covers based on Genres
  const COVER_PRESETS: Record<string, string[]> = {
    Electronic: [
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&q=80'
    ],
    Ambient: [
      'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=400&fit=crop&q=80'
    ],
    Jazz: [
      'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1415886038695-ad2303ebe2af?w=400&h=400&fit=crop&q=80'
    ],
    Rock: [
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&q=80'
    ],
    'R&B': [
      'https://images.unsplash.com/photo-1415886038695-ad2303ebe2af?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop&q=80'
    ],
    Folk: [
      'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&q=80'
    ],
    Techno: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop&q=80'
    ],
    Chillout: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&q=80'
    ],
    Indie: [
      'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop&q=80'
    ],
    Synthpop: [
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop&q=80'
    ],
    'Dream Pop': [
      'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop&q=80'
    ]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        handleFileChange(file);
      } else {
        onToast('Please upload a valid audio file!', 'e');
      }
    }
  };

  const handleFileChange = (file: File) => {
    setAudioFile(file);
    if (!title) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(nameWithoutExt);
    }
    const objectUrl = URL.createObjectURL(file);
    const tempAudio = new Audio(objectUrl);
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration)) {
        setDuration(Math.round(tempAudio.duration));
      }
      URL.revokeObjectURL(objectUrl);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !artist.trim() || !genre) {
      onToast('Title, Artist, and Genre are required!', 'e');
      return;
    }

    if (!audioFile) {
      onToast('Please upload an audio file for the track!', 'e');
      return;
    }

    const defaultCover = COVER_PRESETS[genre]?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&q=80';

    onAddSong({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Single',
      genre,
      dur: Number(duration) || 180,
      plays: Number(plays) || Math.floor(Math.random() * 8000),
      liked: false,
      cover: cover.trim() || defaultCover,
      urls: []
    }, audioFile);

    onToast(`Song "${title}" added successfully!`, 's');

    // Reset Form
    setTitle('');
    setArtist('');
    setAlbum('');
    setGenre('');
    setDuration(200);
    setPlays(15000);
    setCover('');
    setAudioFile(null);

    // Go to Manage list
    setActiveTab('manage');
  };

  // Generate Admin Statistics
  const genresCount: Record<string, number> = {};
  let totalPlays = 0;
  songs.forEach(s => {
    genresCount[s.genre] = (genresCount[s.genre] || 0) + 1;
    totalPlays += s.plays;
  });

  const uniqueArtists = new Set(songs.map(s => s.artist)).size;
  const adminAddedCount = songs.filter(s => s.adminAdded).length;

  const filteredSongs = songs.filter(s => {
    const matchQ = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchG = !genreFilter || s.genre === genreFilter;
    return matchQ && matchG;
  });

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-b3 border border-white/10 rounded-3xl max-w-[650px] w-full shadow-2xl overflow-hidden my-8 animate-in fade-in slide-in-from-top-6 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-y/15 to-pi/5 border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-y to-pi flex items-center justify-center text-lg">
              ⚙️
            </div>
            <div>
              <h3 className="font-extrabold text-base text-t1 font-outfit">WaveOS Administrative Dashboard</h3>
              <p className="text-[11px] text-y font-bold">{songs.length} tracks registered in local catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-t2 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 bg-b2">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'add'
                ? 'border-y text-y'
                : 'border-transparent text-t3 hover:text-t2'
            }`}
          >
            <Plus size={14} /> Add Song
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'manage'
                ? 'border-y text-y'
                : 'border-transparent text-t3 hover:text-t2'
            }`}
          >
            <ListMusic size={14} /> Manage Songs
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'border-y text-y'
                : 'border-transparent text-t3 hover:text-t2'
            }`}
          >
            <BarChart3 size={14} /> Database Stats
          </button>
        </div>

        {/* TAB 1: ADD SONG FORM */}
        {activeTab === 'add' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Song Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream Escape"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 placeholder-t3/50 focus:border-y focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Artist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stella Nebula"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 placeholder-t3/50 focus:border-y focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Album Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cosmic Dust (Optional)"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 placeholder-t3/50 focus:border-y focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Genre *</label>
                <select
                  required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 focus:border-y focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Select genre...</option>
                  {Object.keys(COVER_PRESETS).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                  <option value="Classical">Classical</option>
                  <option value="Pop">Pop</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Duration (seconds) *</label>
                <input
                  type="number"
                  required
                  min={30}
                  max={600}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 focus:border-y focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Starting Play Count</label>
                <input
                  type="number"
                  min={0}
                  value={plays}
                  onChange={(e) => setPlays(Number(e.target.value))}
                  className="w-full bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 focus:border-y focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Cover Image URL</label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... (optional)"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="flex-1 bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 placeholder-t3/50 focus:border-y focus:outline-none transition-all"
                />
                {cover.startsWith('http') && (
                  <img
                    src={cover}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover bg-b4 border border-white/10 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Genre suggestions */}
              {genre && COVER_PRESETS[genre] && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-t3 font-bold mr-1">Presets:</span>
                  {COVER_PRESETS[genre].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      onClick={() => setCover(url)}
                      className={`w-7 h-7 rounded-md object-cover cursor-pointer hover:scale-105 active:scale-95 transition-all border-2 ${
                        cover === url ? 'border-y' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-t3 uppercase">Audio File *</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  dragActive
                    ? 'border-y bg-y/5'
                    : audioFile
                    ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                    : 'border-white/10 bg-b4 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                
                {audioFile ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 animate-pulse">
                      <Music size={18} />
                    </div>
                    <div className="text-xs font-bold text-t1 max-w-[400px] truncate">
                      {audioFile.name}
                    </div>
                    <div className="text-[10px] text-green-400 font-mono">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB · Auto-detected duration · Click to replace
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-t3">
                      <Upload size={18} />
                    </div>
                    <div className="text-xs font-bold text-t2">
                      Upload Audio File
                    </div>
                    <div className="text-[10px] text-t3">
                      Drag & Drop MP3, WAV or M4A, or click to browse
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-y to-pi text-white font-extrabold text-sm rounded-xl font-outfit shadow-lg shadow-y/10 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
              >
                ➕ Register Track into Catalog
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MANAGE SONGS */}
        {activeTab === 'manage' && (
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search tracks to manage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-b4 border border-white/10 rounded-xl px-4 py-2 text-sm text-t1 placeholder-t3/50 focus:outline-none transition-all"
              />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-b4 border border-white/10 rounded-xl px-3 py-2 text-xs text-t1 focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Genres</option>
                {Object.keys(COVER_PRESETS).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2.5 bg-b4/50 hover:bg-b4 border border-white/5 hover:border-white/10 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={song.cover}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-b5 border border-white/5 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-t1 truncate">
                          {song.title}
                          {song.adminAdded && (
                            <span className="ml-1.5 text-[8px] font-black bg-p/20 text-p2 px-1.5 py-0.5 rounded-full uppercase">
                              NEW
                            </span>
                          )}
                        </h5>
                        <p className="text-[11px] text-t2 truncate">{song.artist} · <span className="text-t3">{song.genre}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        onClick={() => onPlaySong(song)}
                        className="w-7 h-7 rounded-full bg-p/15 hover:bg-p/30 text-p2 flex items-center justify-center text-xs transition-all cursor-pointer"
                        title="Preview Play"
                      >
                        <Play size={11} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${song.title}" from library permanently?`)) {
                            onRemoveSong(song.id);
                            onToast(`Removed "${song.title}"`, 'w');
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-all cursor-pointer"
                        title="Delete Track"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-t3 text-xs">No registered songs fit your search.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STATS */}
        {activeTab === 'stats' && (
          <div className="p-6 space-y-5">
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-b4/50 border border-white/5 rounded-xl text-center">
                <div className="text-xl mb-1">🎵</div>
                <div className="text-base font-extrabold text-t1 font-outfit">{songs.length}</div>
                <div className="text-[10px] text-t3">Total Tracks</div>
              </div>
              <div className="p-3 bg-b4/50 border border-white/5 rounded-xl text-center">
                <div className="text-xl mb-1">🎤</div>
                <div className="text-base font-extrabold text-t1 font-outfit">{uniqueArtists}</div>
                <div className="text-[10px] text-t3">Artists</div>
              </div>
              <div className="p-3 bg-b4/50 border border-white/5 rounded-xl text-center">
                <div className="text-xl mb-1">➕</div>
                <div className="text-base font-extrabold text-t1 font-outfit">{adminAddedCount}</div>
                <div className="text-[10px] text-t3">Custom Added</div>
              </div>
            </div>

            {/* Genre Distribution Horizontal Chart */}
            <div className="p-4 bg-b4/30 border border-white/5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-t1 flex items-center gap-1.5 font-outfit">
                <Database size={13} className="text-y" /> Songs catalog by Genre
              </h4>
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {Object.entries(genresCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([g, n]) => {
                    const maxVal = Math.max(...Object.values(genresCount), 1);
                    return (
                      <div key={g} className="flex items-center gap-2.5">
                        <span className="w-16 text-[11px] text-t2 truncate">{g}</span>
                        <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-y to-pi rounded-full transition-all duration-700"
                            style={{ width: `${(n / maxVal) * 100}%` }}
                          />
                        </div>
                        <span className="w-5 text-right text-[11px] font-bold font-mono text-t1">{n}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
