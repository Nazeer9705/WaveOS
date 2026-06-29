import React, { useState, useEffect, useRef } from 'react';
import { Song, Playlist, Friend, PlaybackRepeat } from './types';
import { INITIAL_SONGS, FRIENDS } from './data';
import { audioService } from './lib/audioService';
import { saveLocalAudio, deleteLocalAudio } from './lib/indexedDb';

// Layout / Component Imports
import { Sidebar } from './components/Sidebar';
import { Topnav } from './components/Topnav';
import { RoleSelection } from './components/RoleSelection';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ShareModal } from './components/ShareModal';
import { ContextMenu } from './components/ContextMenu';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { MiniPlayer } from './components/MiniPlayer';
import { PlaybackSlider } from './components/PlaybackSlider';

// Views
import { ViewHome } from './components/ViewHome';
import { ViewSearch } from './components/ViewSearch';
import { ViewMood } from './components/ViewMood';
import { ViewLibrary } from './components/ViewLibrary';
import { ViewQueue } from './components/ViewQueue';
import { ViewLyrics } from './components/ViewLyrics';
import { ViewProfile } from './components/ViewProfile';
import { ViewAnalytics } from './components/ViewAnalytics';
import { ViewPremium } from './components/ViewPremium';
import { ViewSettings } from './components/ViewSettings';

// Icon for persistent footer
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, Maximize2, Sparkles, Heart } from 'lucide-react';

interface ToastMessage {
  id: number;
  message: string;
  type: 's' | 'i' | 'e' | 'w'; // success, info, error, warning
}

export default function App() {
  // 1. Core Profile / Context States
  const [role, setRole] = useState<'user' | 'admin' | null>(() => {
    const cached = localStorage.getItem('waveos_role');
    return (cached as 'user' | 'admin') || null;
  });

  // 2. Catalog & History Database
  const [songs, setSongs] = useState<Song[]>(() => {
    const cached = localStorage.getItem('waveos_songs');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return INITIAL_SONGS; }
    }
    return INITIAL_SONGS;
  });

  const [history, setHistory] = useState<Song[]>(() => {
    const cached = localStorage.getItem('waveos_history');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [];
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const cached = localStorage.getItem('waveos_playlists');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [];
  });

  // 3. Playback State Engine
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<PlaybackRepeat>('none');
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.0);

  // 4. Sleep Timer
  const [sleepEnd, setSleepEnd] = useState<number | null>(null);

  // 5. UI Customization & Layout Toggles
  const [currentView, setCurrentView] = useState('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [shareSong, setShareSong] = useState<Song | null>(null);
  const [activeContext, setActiveContext] = useState<{ song: Song; x: number; y: number } | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 6. Audio Player Preferences
  const [eqPreset, setEQPreset] = useState('flat');
  const [crossfade, setCrossfade] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [autoPlaySimilar, setAutoPlaySimilar] = useState(true);
  const [autoShowLyrics, setAutoShowLyrics] = useState(false);

  const audioTimerRef = useRef<number | null>(null);

  // Synchronize Cache with localStorage on changes
  useEffect(() => {
    localStorage.setItem('waveos_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('waveos_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('waveos_playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Handle Role updates
  const handleSelectRole = (selectedRole: 'user' | 'admin') => {
    setRole(selectedRole);
    localStorage.setItem('waveos_role', selectedRole);
    triggerToast(`👋 Welcome to WaveOS! Context set as ${selectedRole === 'admin' ? 'Administrator' : 'Listener'}.`, 's');
  };

  // Toast dispatch engine
  const triggerToast = (message: string, type: 's' | 'i' | 'e' | 'w' = 'i') => {
    const id = Date.now() + Math.floor(Math.random() * 100);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync volume with Audio Service
  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  // Sync speed with Audio Service
  useEffect(() => {
    audioService.setSpeed(speed);
  }, [speed]);

  // Audio Service Tick progress trackers
  useEffect(() => {
    const handleTimeUpdate = (time: number, dur: number) => {
      setCurrentTime(time);
      setDuration(dur);
    };
    const handleEnd = () => {
      handleNextTrack();
    };
    const handlePlayStatus = (playing: boolean) => {
      setIsPlaying(playing);
    };

    audioService.registerCallbacks(handleTimeUpdate, handleEnd, handlePlayStatus);

    return () => {
      // Cleanup events
      audioService.registerCallbacks(() => {}, () => {}, () => {});
    };
  }, [queue, currentIndex, repeat, shuffle]);

  // Sleep timer ticker
  useEffect(() => {
    if (!sleepEnd) return;
    const interval = setInterval(() => {
      if (Date.now() >= sleepEnd) {
        audioService.pause();
        setIsPlaying(false);
        setSleepEnd(null);
        triggerToast('🌙 Sleep timer finished. Sound suspended.', 'i');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepEnd]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts if user is currently typing in an input form field
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'arrowright':
          e.preventDefault();
          handleNextTrack();
          break;
        case 'arrowleft':
          e.preventDefault();
          handlePrevTrack();
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.05));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.05));
          break;
        case 'm':
          setVolume((v) => (v > 0 ? 0 : 0.8));
          break;
        case 'l':
          if (currentSong) handleLikeToggle(currentSong.id);
          break;
        case 'q':
          setCurrentView('queue');
          break;
        case 'p':
          setIsMini((m) => !m);
          break;
        case 'f':
          setIsFullscreen((f) => !f);
          break;
        case 's':
          e.preventDefault();
          setCurrentView('search');
          setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) input.focus();
          }, 100);
          break;
        case 'escape':
          setActiveContext(null);
          setShareSong(null);
          setIsFullscreen(false);
          setShowAdmin(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong, isPlaying, queue, currentIndex]);

  // PLAY SONG UTILITY
  const handlePlaySong = (song: Song, newQueue?: Song[], index?: number) => {
    // If double clicking active song, toggle play
    if (currentSong?.id === song.id) {
      handleTogglePlay();
      return;
    }

    if (newQueue) {
      setQueue(newQueue);
      if (index !== undefined) {
        setCurrentIndex(index);
      } else {
        setCurrentIndex(newQueue.findIndex((s) => s.id === song.id));
      }
    } else {
      // Append to end of queue or insert next
      const alreadyInQueue = queue.findIndex((s) => s.id === song.id);
      if (alreadyInQueue >= 0) {
        setCurrentIndex(alreadyInQueue);
      } else {
        const nextQueue = [...queue];
        nextQueue.splice(currentIndex + 1, 0, song);
        setQueue(nextQueue);
        setCurrentIndex(currentIndex + 1);
      }
    }

    setCurrentSong(song);
    setIsPlaying(true);

    // Sync AudioService play
    audioService.play(song);

    // Add track into listening history list
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== song.id);
      return [song, ...filtered].slice(0, 50); // limit to last 50 recents
    });

    if (autoShowLyrics) {
      setCurrentView('lyrics');
    }
  };

  const handleTogglePlay = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        handlePlaySong(songs[0], songs, 0);
      }
      return;
    }

    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
    } else {
      audioService.resume();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;

    if (repeat === 'one' && currentSong) {
      audioService.seek(0);
      audioService.resume();
      setIsPlaying(true);
      return;
    }

    let nextIdx = currentIndex + 1;

    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeat === 'all') {
        nextIdx = 0;
      } else {
        // Queue finished. If auto play similar is enabled, look up matching genre songs
        if (autoPlaySimilar && currentSong) {
          const matchingSongs = songs.filter((s) => s.genre === currentSong.genre && s.id !== currentSong.id);
          if (matchingSongs.length > 0) {
            const extraSong = matchingSongs[Math.floor(Math.random() * matchingSongs.length)];
            const nextQueue = [...queue, extraSong];
            setQueue(nextQueue);
            setCurrentIndex(nextQueue.length - 1);
            setCurrentSong(extraSong);
            audioService.play(extraSong);
            return;
          }
        }
        setIsPlaying(false);
        return;
      }
    }

    const nextSong = queue[nextIdx];
    setCurrentIndex(nextIdx);
    setCurrentSong(nextSong);
    setIsPlaying(true);
    audioService.play(nextSong);
  };

  const handlePrevTrack = () => {
    if (queue.length === 0) return;

    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeat === 'all') {
        prevIdx = queue.length - 1;
      } else {
        prevIdx = 0; // Cap
      }
    }

    const prevSong = queue[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentSong(prevSong);
    setIsPlaying(true);
    audioService.play(prevSong);
  };

  const handleSeek = (pct: number) => {
    if (!currentSong) return;
    const target = duration * pct;
    audioService.seek(target);
    setCurrentTime(target);
  };

  // Track manipulation callbacks
  const handleLikeToggle = (id: number) => {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextLike = !s.liked;
          triggerToast(nextLike ? `❤️ Added "${s.title}" to loved collection` : `💔 Removed "${s.title}" from liked songs`, 'i');
          return { ...s, liked: nextLike };
        }
        return s;
      })
    );

    // Sync in active playing song
    if (currentSong?.id === id) {
      setCurrentSong((prev) => prev ? { ...prev, liked: !prev.liked } : null);
    }
  };

  const handleAddSong = async (newSongData: Omit<Song, 'id'>, audioFile?: File | Blob) => {
    const nextId = Math.max(...songs.map((s) => s.id), 0) + 1;
    let finalUrls = newSongData.urls;

    if (audioFile) {
      try {
        await saveLocalAudio(nextId, audioFile);
        finalUrls = [`local://${nextId}`];
      } catch (err) {
        console.error("Failed to save local audio to IndexedDB", err);
        triggerToast("Failed to save local audio to browser storage", "e");
      }
    }

    const freshSong: Song = {
      ...newSongData,
      id: nextId,
      urls: finalUrls,
      adminAdded: true,
    };
    setSongs((prev) => [freshSong, ...prev]);
  };

  const handleRemoveSong = async (id: number) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    if (currentSong?.id === id) {
      audioService.stopAll();
      setCurrentSong(null);
      setIsPlaying(false);
    }
    try {
      await deleteLocalAudio(id);
    } catch (err) {
      console.error("Failed to delete local audio from IndexedDB", err);
    }
  };

  // Context Menu operations
  const handleSongContextMenu = (e: React.MouseEvent, song: Song) => {
    e.preventDefault();
    setActiveContext({
      song,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleContextAction = (action: string, song: Song) => {
    setActiveContext(null);
    switch (action) {
      case 'play':
        handlePlaySong(song);
        break;
      case 'queue':
        setQueue((prev) => [...prev, song]);
        triggerToast(`📋 Loaded "${song.title}" to bottom of active queue`, 's');
        break;
      case 'like':
        handleLikeToggle(song.id);
        break;
      case 'share':
        setShareSong(song);
        break;
      case 'create-playlist':
        // Build playlist
        const plId = Date.now();
        const pl: Playlist = {
          id: plId,
          name: `Curated ${song.genre} Vibe`,
          desc: `Playlist starting with ${song.title}`,
          songs: [song.id],
          pub: true,
        };
        setPlaylists((prev) => [...prev, pl]);
        triggerToast(`🎵 Created Curated Playlist containing "${song.title}"`, 's');
        break;
    }
  };

  // User Playlists creation
  const handleCreatePlaylist = (name: string, desc: string, pub: boolean) => {
    const pl: Playlist = {
      id: Date.now(),
      name,
      desc,
      songs: currentSong ? [currentSong.id] : [],
      pub,
    };
    setPlaylists((prev) => [...prev, pl]);
  };

  const handlePlayPlaylist = (playlistId: number) => {
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    const plSongs = pl.songs
      .map((id) => songs.find((s) => s.id === id))
      .filter((s): s is Song => !!s);

    if (plSongs.length === 0) {
      triggerToast(`Playlist "${pl.name}" is empty. Click songs context menus to populate it.`, 'w');
      return;
    }

    handlePlaySong(plSongs[0], plSongs, 0);
    triggerToast(`▶ Listening to playlist: "${pl.name}" — ${plSongs.length} tracks`, 's');
  };

  // Add song to playlist
  const handleAddSongToPlaylist = (playlistId: number, songId: number) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songs.includes(songId)) {
            triggerToast('Track is already in this playlist!', 'w');
            return pl;
          }
          triggerToast('Added song to playlist!', 's');
          return { ...pl, songs: [...pl.songs, songId] };
        }
        return pl;
      })
    );
  };

  // Clear History / Backup Operations
  const handleClearHistory = () => {
    setHistory([]);
    triggerToast('🕒 Listening history list cleared.', 'i');
  };

  const handleResetAllData = () => {
    if (confirm('Are you absolutely sure you want to restore default factory settings? This clears all custom playlists, added songs, and likes.')) {
      localStorage.removeItem('waveos_songs');
      localStorage.removeItem('waveos_history');
      localStorage.removeItem('waveos_playlists');
      localStorage.removeItem('waveos_role');
      setSongs(INITIAL_SONGS);
      setHistory([]);
      setPlaylists([]);
      setRole(null);
      setCurrentSong(null);
      setIsPlaying(false);
      audioService.pause();
      triggerToast('Factory backup reset completed successfully.', 's');
    }
  };

  const handleExportData = () => {
    const backupObj = { songs, history, playlists };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "waveos_ultra_backup.json");
    dlAnchor.click();
    triggerToast('📥 JSON catalog backup exported successfully!', 's');
  };

  // Render view controller
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <ViewHome
            songs={songs}
            friends={FRIENDS}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onNavigate={setCurrentView}
            onContextMenu={handleSongContextMenu}
          />
        );
      case 'search':
        return (
          <ViewSearch
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onContextMenu={handleSongContextMenu}
          />
        );
      case 'mood':
        return (
          <ViewMood
            songs={songs}
            onPlaySong={handlePlaySong}
            speed={speed}
            onSetSpeed={setSpeed}
            sleepEnd={sleepEnd}
            onSetSleep={(mins) => {
              setSleepEnd(Date.now() + mins * 60000);
              triggerToast(`🌙 Sleep timer set for ${mins} minutes`, 's');
            }}
            onCancelSleep={() => {
              setSleepEnd(null);
              triggerToast('Sleep timer cancelled', 'i');
            }}
            onToast={triggerToast}
          />
        );
      case 'library':
        return (
          <ViewLibrary
            songs={songs}
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onPlayPlaylist={handlePlayPlaylist}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onContextMenu={handleSongContextMenu}
            onToast={triggerToast}
            currentSong={currentSong}
            isPlaying={isPlaying}
          />
        );
      case 'queue':
        return (
          <ViewQueue
            queue={queue}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onContextMenu={handleSongContextMenu}
            onClearQueue={() => {
              setQueue([]);
              setCurrentIndex(-1);
              triggerToast('Cleared active queue', 'w');
            }}
            onShuffleQueue={() => {
              const shuffled = [...queue].sort(() => Math.random() - 0.5);
              setQueue(shuffled);
              setCurrentIndex(shuffled.findIndex((s) => s.id === currentSong?.id));
              triggerToast('Shuffled playback queue', 's');
            }}
            onSaveQueueAsPlaylist={() => {
              if (queue.length === 0) return;
              const pl: Playlist = {
                id: Date.now(),
                name: 'Curated Flow Queue',
                desc: 'Saved from active backup queue',
                songs: queue.map((s) => s.id),
                pub: true,
              };
              setPlaylists((prev) => [...prev, pl]);
              triggerToast('Curated queue saved as playlist!', 's');
            }}
            onLoadAllSongsToQueue={() => {
              setQueue(songs);
              setCurrentIndex(currentSong ? songs.findIndex((s) => s.id === currentSong.id) : 0);
              triggerToast('Catalog tracks successfully loaded into queue!', 's');
            }}
          />
        );
      case 'lyrics':
        return <ViewLyrics currentSong={currentSong} onToast={triggerToast} />;
      case 'profile':
        return (
          <ViewProfile
            songs={songs}
            history={history}
            playlistsCount={playlists.length}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onContextMenu={handleSongContextMenu}
          />
        );
      case 'analytics':
        return (
          <ViewAnalytics
            songs={songs}
            history={history}
            playlistsCount={playlists.length}
            onPlaySong={handlePlaySong}
            onLikeToggle={handleLikeToggle}
            onContextMenu={handleSongContextMenu}
          />
        );
      case 'premium':
        return <ViewPremium onToast={triggerToast} />;
      case 'settings':
        return (
          <ViewSettings
            eqPreset={eqPreset}
            onSetEQPreset={setEQPreset}
            crossfade={crossfade}
            onSetCrossfade={setCrossfade}
            compactMode={compactMode}
            onSetCompactMode={setCompactMode}
            autoPlaySimilar={autoPlaySimilar}
            onSetAutoPlaySimilar={setAutoPlaySimilar}
            autoShowLyrics={autoShowLyrics}
            onSetAutoShowLyrics={setAutoShowLyrics}
            onClearHistory={handleClearHistory}
            onResetAllData={handleResetAllData}
            onExportData={handleExportData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-b0 overflow-hidden text-t1 selection:bg-p/30 select-none ${compactMode ? 'text-dense' : ''}`}>
      
      {/* 1. Onboarding Role Selector (If first visit) */}
      {role === null && <RoleSelection onSelectRole={handleSelectRole} />}

      {/* 2. Main Shell Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          playlists={playlists}
          onPlayPlaylist={handlePlayPlaylist}
          isAdmin={role === 'admin'}
          onOpenAdmin={() => setShowAdmin(true)}
          onCloseMobile={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />

        {/* Content Panel Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-b1">
          <Topnav
            currentView={currentView}
            onNavigate={setCurrentView}
            onOpenMobileSidebar={() => setSidebarOpen(true)}
            speed={speed}
            onCycleSpeed={() => {
              const nextSpeed = speed === 1.0 ? 1.5 : speed === 1.5 ? 2.0 : speed === 2.0 ? 0.75 : 1.0;
              setSpeed(nextSpeed);
              triggerToast(`⏩ Set playback speed to ${nextSpeed}x`, 'i');
            }}
            onToggleMini={() => setIsMini(!isMini)}
            isAdmin={role === 'admin'}
            onOpenAdmin={() => setShowAdmin(true)}
          />

          {/* Core View Scrollable Container */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* 3. Dynamic Footer Playbar (Floats if currentSong active) */}
      {currentSong && (
        <footer className="h-[76px] sm:h-[84px] bg-b0 border-t border-white/5 flex items-center justify-between px-4 sm:px-6 z-40 relative">
          
          {/* Left: Metadata */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
            <img
              src={currentSong.cover}
              alt=""
              onClick={() => setIsFullscreen(true)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/5 shadow-md cursor-pointer hover:scale-103 active:scale-95 transition-all shrink-0 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            />
            <div className="min-w-0">
              <h4
                onClick={() => setIsFullscreen(true)}
                className="text-xs sm:text-[13px] font-black text-t1 truncate hover:text-p2 cursor-pointer leading-tight font-outfit"
              >
                {currentSong.title}
              </h4>
              <p className="text-[10.5px] text-t3 truncate leading-normal mt-0.5">{currentSong.artist}</p>
            </div>

            {/* Quick Heart */}
            <button
              onClick={() => handleLikeToggle(currentSong.id)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs transition-all cursor-pointer ml-1 shrink-0"
            >
              <Heart
                size={11}
                fill={currentSong.liked ? 'var(--color-pi)' : 'none'}
                stroke={currentSong.liked ? 'var(--color-pi)' : 'currentColor'}
                className={currentSong.liked ? 'text-pi scale-110' : 'text-t3 hover:text-t2'}
              />
            </button>
          </div>

          {/* Center: Playback Controls */}
          <div className="hidden sm:flex flex-col items-center gap-2 max-w-[380px] w-full px-4">
            <div className="flex items-center gap-4.5">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`text-xs hover:text-white transition-all cursor-pointer ${
                  shuffle ? 'text-p2 font-bold' : 'text-t3'
                }`}
                title="Shuffle queue"
              >
                <Shuffle size={13} />
              </button>

              <button
                onClick={handlePrevTrack}
                className="text-t3 hover:text-white transition-all cursor-pointer"
                title="Prev song"
              >
                <SkipBack size={15} fill="currentColor" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-8 h-8 bg-white text-b0 hover:scale-107 active:scale-95 flex items-center justify-center rounded-full shadow-lg transition-all cursor-pointer"
                title="Spacebar"
              >
                {isPlaying ? (
                  <Pause size={12} fill="currentColor" className="text-b0" />
                ) : (
                  <Play size={12} fill="currentColor" className="ml-0.5 text-b0" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="text-t3 hover:text-white transition-all cursor-pointer"
                title="Next song"
              >
                <SkipForward size={15} fill="currentColor" />
              </button>

              <button
                onClick={() => {
                  const cycle: PlaybackRepeat[] = ['none', 'all', 'one'];
                  const nextIdx = (cycle.indexOf(repeat) + 1) % cycle.length;
                  setRepeat(cycle[nextIdx]);
                  triggerToast(`Repeat set to: ${cycle[nextIdx].toUpperCase()}`, 'i');
                }}
                className={`text-xs hover:text-white transition-all cursor-pointer relative ${
                  repeat !== 'none' ? 'text-p2 font-bold' : 'text-t3'
                }`}
                title="Repeat mode"
              >
                <Repeat size={13} />
                {repeat === 'one' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-p2 rounded-full" />
                )}
              </button>
            </div>

            {/* Slider bar progress indicator */}
            <PlaybackSlider
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              variant="footer"
            />
          </div>

          {/* Right: Audio Volume and triggers */}
          <div className="flex items-center gap-3 shrink-0 ml-4 sm:ml-0">
            {/* Play trigger button on Mobile Only */}
            <button
              onClick={handleTogglePlay}
              className="sm:hidden w-9 h-9 bg-white text-b0 active:scale-95 flex items-center justify-center rounded-full shadow transition-all cursor-pointer shrink-0"
            >
              {isPlaying ? (
                <Pause size={12} fill="currentColor" className="text-b0" />
              ) : (
                <Play size={12} fill="currentColor" className="ml-0.5 text-b0" />
              )}
            </button>

            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              className="text-t3 hover:text-white transition-all cursor-pointer shrink-0 hidden sm:block"
            >
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={volume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-16 sm:w-20 h-1 bg-white/10 hover:h-1.5 rounded-full cursor-pointer appearance-none shrink-0 transition-all hidden sm:block"
              title="Adjust Volume"
            />

            <button
              onClick={() => setIsFullscreen(true)}
              className="text-t3 hover:text-white transition-all cursor-pointer shrink-0 p-1.5 rounded hover:bg-white/5"
              title="Expand Immersive Canvas (F)"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </footer>
      )}

      {/* 4. OVERLAY DIALOG MODALS & SPECIAL COMPONENTS */}

      {/* Admin Panel Modal Overlay */}
      <AdminPanelModal
        visible={showAdmin}
        onClose={() => setShowAdmin(false)}
        songs={songs}
        onAddSong={handleAddSong}
        onRemoveSong={handleRemoveSong}
        onPlaySong={(song) => handlePlaySong(song, songs, songs.indexOf(song))}
        onToast={triggerToast}
      />

      {/* Share Song Dialog Modal */}
      <ShareModal
        visible={shareSong !== null}
        onClose={() => setShareSong(null)}
        song={shareSong}
        onToast={triggerToast}
      />

      {/* Context Menu Right-click floating drawer */}
      <ContextMenu
        activeContext={activeContext}
        onClose={() => setActiveContext(null)}
        playlists={playlists}
        onAction={handleContextAction}
        onAddToPlaylist={handleAddSongToPlaylist}
      />

      {/* Immersive Fullscreen Backdrop view screen overlay */}
      <FullscreenPlayer
        visible={isFullscreen}
        song={currentSong}
        isPlaying={isPlaying}
        onClose={() => setIsFullscreen(false)}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        shuffle={shuffle}
        onToggleShuffle={() => setShuffle(!shuffle)}
        repeat={repeat}
        onCycleRepeat={() => {
          const cycle: PlaybackRepeat[] = ['none', 'all', 'one'];
          const nextIdx = (cycle.indexOf(repeat) + 1) % cycle.length;
          setRepeat(cycle[nextIdx]);
        }}
        onLikeToggle={handleLikeToggle}
        volume={volume}
        onSetVolume={setVolume}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* Picture-in-picture floating Mini player */}
      <MiniPlayer
        visible={isMini}
        song={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onClose={() => setIsMini(false)}
        onOpenFull={() => {
          setIsMini(false);
          setIsFullscreen(true);
        }}
      />

      {/* Dynamic Slide-in Alert Toasts Drawer (Glow theme) */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2.5 max-w-[340px] w-full pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === 's';
          const isError = t.type === 'e';
          const isWarn = t.type === 'w';

          return (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 bg-b3/95 backdrop-blur-md pointer-events-auto animate-in slide-in-from-left-8 duration-300 ${
                isSuccess
                  ? 'border-gr/20 text-gr'
                  : isError
                  ? 'border-red-500/20 text-red-400'
                  : isWarn
                  ? 'border-y/20 text-y'
                  : 'border-p/20 text-p2'
              }`}
            >
              <div className="text-base">
                {isSuccess ? '✅' : isError ? '❌' : isWarn ? '⚠️' : '⚡'}
              </div>
              <div className="text-[12px] font-bold font-outfit text-t1 leading-snug">{t.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
