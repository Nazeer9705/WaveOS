import React from 'react';
import { Sliders, Play, Settings, RefreshCw, Layers } from 'lucide-react';

interface ViewSettingsProps {
  eqPreset: string;
  onSetEQPreset: (preset: string) => void;
  crossfade: boolean;
  onSetCrossfade: (on: boolean) => void;
  compactMode: boolean;
  onSetCompactMode: (on: boolean) => void;
  autoPlaySimilar: boolean;
  onSetAutoPlaySimilar: (on: boolean) => void;
  autoShowLyrics: boolean;
  onSetAutoShowLyrics: (on: boolean) => void;
  onClearHistory: () => void;
  onResetAllData: () => void;
  onExportData: () => void;
}

export const ViewSettings: React.FC<ViewSettingsProps> = ({
  eqPreset,
  onSetEQPreset,
  crossfade,
  onSetCrossfade,
  compactMode,
  onSetCompactMode,
  autoPlaySimilar,
  onSetAutoPlaySimilar,
  autoShowLyrics,
  onSetAutoShowLyrics,
  onClearHistory,
  onResetAllData,
  onExportData,
}) => {
  const keyboardShortcuts = [
    { key: 'Space', desc: 'Play / Pause toggle' },
    { key: '→', desc: 'Next track' },
    { key: '←', desc: 'Previous track' },
    { key: '↑', desc: 'Volume increase' },
    { key: '↓', desc: 'Volume decrease' },
    { key: 'M', desc: 'Mute / Unmute' },
    { key: 'L', desc: 'Love / Unlike active song' },
    { key: 'Q', desc: 'Open Playback Queue' },
    { key: 'P', desc: 'Toggle Picture-in-Picture Mini Player' },
    { key: 'F', desc: 'Immersive Fullscreen page' },
    { key: 'S', desc: 'Focus search catalog input' },
    { key: 'Esc', desc: 'Close any active overlay sheet' },
  ];

  return (
    <div className="view-container max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Audio Section */}
      <div className="bg-b2 border border-white/5 rounded-3xl p-6 space-y-5">
        <h4 className="text-sm font-extrabold text-white font-outfit flex items-center gap-2">
          <Sliders size={15} className="text-p2" /> Audio Configuration Preset
        </h4>

        {/* EQ Preset */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Equalizer Profile</div>
            <div className="text-[11px] text-t3">Apply customized audio curve styles</div>
          </div>
          <select
            value={eqPreset}
            onChange={(e) => onSetEQPreset(e.target.value)}
            className="bg-b4 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-t1 focus:outline-none transition-all cursor-pointer"
          >
            <option value="flat">Flat</option>
            <option value="bass">Bass Boost</option>
            <option value="treble">Treble Boost</option>
            <option value="vocal">Vocal Enhance</option>
            <option value="classical">Classical</option>
            <option value="electronic">Electronic</option>
          </select>
        </div>

        {/* Crossfade */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Seamless Crossfade</div>
            <div className="text-[11px] text-t3">Blend tracks together smoothly (2 seconds)</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={crossfade}
              onChange={(e) => onSetCrossfade(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-b5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-p" />
          </label>
        </div>

        {/* Normalization */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Volume Normalize</div>
            <div className="text-[11px] text-t3">Maintains steady volume level matching loudness</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-b5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-p" />
          </label>
        </div>
      </div>

      {/* 2. Playback Settings */}
      <div className="bg-b2 border border-white/5 rounded-3xl p-6 space-y-5">
        <h4 className="text-sm font-extrabold text-white font-outfit flex items-center gap-2">
          <Play size={15} className="text-c" /> Playback Preferences
        </h4>

        {/* Auto play similar */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Auto-Play Similar Vibe</div>
            <div className="text-[11px] text-t3">Load and continue playback of related tracks automatically</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPlaySimilar}
              onChange={(e) => onSetAutoPlaySimilar(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-b5 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-p" />
          </label>
        </div>

        {/* Auto show lyrics */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Auto-open Lyrics Screen</div>
            <div className="text-[11px] text-t3">Instantly load the active lyrics page when a song changes</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoShowLyrics}
              onChange={(e) => onSetAutoShowLyrics(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-b5 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-p" />
          </label>
        </div>
      </div>

      {/* 3. Display customization */}
      <div className="bg-b2 border border-white/5 rounded-3xl p-6 space-y-5">
        <h4 className="text-sm font-extrabold text-white font-outfit flex items-center gap-2">
          <Layers size={15} className="text-pi" /> Theme & Canvas Layout
        </h4>

        {/* Compact mode toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="text-xs font-bold text-t1 mb-0.5">Compact Display</div>
            <div className="text-[11px] text-t3">Reduces visual margins and text scaling across client layouts</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => onSetCompactMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-b5 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-p" />
          </label>
        </div>
      </div>

      {/* 4. Data resets & exports */}
      <div className="bg-b2 border border-white/5 rounded-3xl p-6 space-y-5">
        <h4 className="text-sm font-extrabold text-white font-outfit flex items-center gap-2">
          <Settings size={15} className="text-y" /> Database Backup & Local Resets
        </h4>
        <div className="flex gap-2.5 flex-wrap pt-2">
          <button
            onClick={onExportData}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-t2 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/5"
          >
            📥 Export JSON Backup
          </button>
          <button
            onClick={onClearHistory}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-t2 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/5"
          >
            🕒 Clear History
          </button>
          <button
            onClick={onResetAllData}
            className="px-4 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            🗑 Reset client settings & local state
          </button>
        </div>
      </div>

      {/* 5. Keyboard Shortcuts cheat-sheet */}
      <div className="bg-b2 border border-white/5 rounded-3xl p-6 space-y-4">
        <h4 className="text-sm font-extrabold text-white font-outfit">Keyboard Controls Dictionary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {keyboardShortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-b3 border border-white/5 rounded-xl text-xs">
              <span className="text-t2 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 bg-b4 border border-white/10 rounded-md font-mono text-white text-[10.5px] font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
