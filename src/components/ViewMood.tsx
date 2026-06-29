import React, { useState } from 'react';
import { Song } from '../types';
import { Play, Sparkles, Loader } from 'lucide-react';

interface ViewMoodProps {
  songs: Song[];
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  speed: number;
  onSetSpeed: (rate: number) => void;
  sleepEnd: number | null;
  onSetSleep: (mins: number) => void;
  onCancelSleep: () => void;
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
}

export const ViewMood: React.FC<ViewMoodProps> = ({
  songs,
  onPlaySong,
  speed,
  onSetSpeed,
  sleepEnd,
  onSetSleep,
  onCancelSleep,
  onToast,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const moodPresets = [
    { id: 'happy', emoji: '😊', name: 'Happy', desc: 'Upbeat & energetic', genres: ['Electronic', 'Synthpop'] },
    { id: 'chill', emoji: '😌', name: 'Chill', desc: 'Relax & unwind', genres: ['Chillout', 'Ambient', 'Dream Pop'] },
    { id: 'energy', emoji: '⚡', name: 'Energy', desc: 'High intensity', genres: ['Techno', 'Electronic'] },
    { id: 'focus', emoji: '🎯', name: 'Focus', desc: 'Deep work', genres: ['Ambient', 'Chillout'] },
    { id: 'sleep', emoji: '😴', name: 'Sleep', desc: 'Drift off gently', genres: ['Ambient', 'Folk', 'Dream Pop'] },
    { id: 'workout', emoji: '💪', name: 'Workout', desc: 'Push your limits', genres: ['Techno', 'Electronic', 'Synthpop'] },
    { id: 'sad', emoji: '🌧️', name: 'Melancholic', desc: 'Deep feelings', genres: ['Jazz', 'Folk', 'Alternative'] },
    { id: 'party', emoji: '🎉', name: 'Party', desc: 'Dance floor vibes', genres: ['Electronic', 'Techno', 'Synthpop'] },
  ];

  const handleMoodPresetPlay = (genres: string[], name: string) => {
    let filtered = songs.filter(s => genres.includes(s.genre)).sort(() => Math.random() - 0.5);
    if (filtered.length === 0) {
      filtered = [...songs].sort(() => Math.random() - 0.5).slice(0, 10);
    }
    onPlaySong(filtered[0], filtered, 0);
    onToast(`🎭 Playing "${name}" mood mix — ${filtered.length} songs`, 's');
  };

  const handleCustomAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setLoading(true);
    onToast('⚡ Querying WaveOS Mood AI, compiling custom playlist...', 'i');

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt.trim() }),
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      // Find actual songs in our catalog matching the AI suggestions
      const aiSongIds: number[] = data.songs || [];
      const playlistSongs = aiSongIds
        .map(id => songs.find(s => s.id === id))
        .filter((s): s is Song => !!s);

      if (playlistSongs.length > 0) {
        onPlaySong(playlistSongs[0], playlistSongs, 0);
        onToast(`✨ AI: "${data.name}" mix loaded!`, 's');
        setCustomPrompt('');
      } else {
        onToast('AI playlist was empty. Try another prompt.', 'w');
      }
    } catch (err) {
      console.error(err);
      onToast('AI playlist build failed. Try a simpler prompt.', 'e');
    } finally {
      setLoading(false);
    }
  };

  const remainingSleepTime = () => {
    if (!sleepEnd) return null;
    const diff = sleepEnd - Date.now();
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [timeStr, setTimeStr] = useState(remainingSleepTime());

  // Tick the sleep timer update every second
  React.useEffect(() => {
    if (!sleepEnd) {
      setTimeStr(null);
      return;
    }
    const timer = setInterval(() => {
      const current = remainingSleepTime();
      setTimeStr(current);
      if (!current) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [sleepEnd]);

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-10">
      
      {/* 1. Custom AI Prompt Builder */}
      <section className="bg-gradient-to-br from-p/15 via-b2/40 to-c/10 border border-p/20 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-[-40px] right-[40px] w-48 h-48 rounded-full bg-p/10 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-p2 animate-pulse" />
            <h3 className="text-base font-extrabold text-t1 font-outfit">WaveOS Custom Mood AI</h3>
          </div>
          <span className="text-[10px] font-black uppercase text-c tracking-widest bg-c/10 px-2.5 py-0.5 rounded-full border border-c/20">
            Powered by Gemini
          </span>
        </div>
        <p className="text-xs text-t2 leading-relaxed max-w-[500px]">
          Tell WaveOS how you're feeling, what you're doing, or the vibe you want. Our AI will curate a tailored playlist from our catalog.
        </p>

        <form onSubmit={handleCustomAISubmit} className="flex gap-2">
          <input
            type="text"
            required
            disabled={loading}
            placeholder="e.g. Coding a dark theme dashboard on a rainy midnight, feeling chill..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-b4 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-t1 placeholder-t3/50 focus:border-p/50 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 bg-gradient-to-r from-p to-c text-white font-extrabold text-xs rounded-xl font-outfit hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader size={15} className="animate-spin" /> : 'Generate Vibe'}
          </button>
        </form>
      </section>

      {/* 2. Mood presets grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">Preset Moods</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {moodPresets.map((m) => (
            <div
              key={m.id}
              onClick={() => handleMoodPresetPlay(m.genres, m.name)}
              className="bg-b2 border border-white/5 hover:border-p2/20 rounded-2xl p-5 cursor-pointer text-center group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">{m.emoji}</div>
              <h4 className="text-[13.5px] font-extrabold text-t1 font-outfit">{m.name}</h4>
              <p className="text-[11px] text-t3 mt-1 truncate">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Playback speed & Sleep Timers list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Speed selection */}
        <section className="space-y-4 bg-b2/20 border border-white/5 p-6 rounded-3xl">
          <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">⏩ Playback Speed Rate</h3>
          <p className="text-xs text-t2 leading-relaxed">
            Slow down tracks for relaxing vibes, or speed them up for high-intensity motivation sessions.
          </p>
          <div className="flex gap-2 flex-wrap pt-2">
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => onSetSpeed(rate)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  speed === rate
                    ? 'bg-p/15 text-p2 border border-p/20'
                    : 'bg-white/5 text-t3 hover:bg-white/10 hover:text-t2'
                }`}
              >
                {rate}x {rate === 1.0 ? '(Normal)' : ''}
              </button>
            ))}
          </div>
        </section>

        {/* Sleep timer selection */}
        <section className="space-y-4 bg-b2/20 border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">🌙 Sleep Timer</h3>
            {timeStr && (
              <span className="text-xs font-mono font-bold text-y bg-y/10 px-2.5 py-0.5 rounded-full border border-y/20">
                ⏳ {timeStr} left
              </span>
            )}
          </div>
          <p className="text-xs text-t2 leading-relaxed">
            Configure music to automatically pause after a specific duration so you can drift off gently.
          </p>
          <div className="flex gap-2 flex-wrap pt-2">
            {[5, 15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => onSetSleep(mins)}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-t2 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                {mins} min
              </button>
            ))}
            {sleepEnd && (
              <button
                onClick={onCancelSleep}
                className="px-3.5 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel Timer
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
