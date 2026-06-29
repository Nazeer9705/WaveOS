import React from 'react';
import { Menu, Music, Activity } from 'lucide-react';

interface TopnavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenMobileSidebar: () => void;
  speed: number;
  onCycleSpeed: () => void;
  onToggleMini: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Topnav: React.FC<TopnavProps> = ({
  currentView,
  onNavigate,
  onOpenMobileSidebar,
  speed,
  onCycleSpeed,
  onToggleMini,
  isAdmin,
  onOpenAdmin,
}) => {
  const tabs = [
    { id: 'home', label: '🏠 Home' },
    { id: 'search', label: '🔍 Search' },
    { id: 'mood', label: '🎭 Mood' },
    { id: 'library', label: '📚 Library' },
    { id: 'lyrics', label: '🎤 Lyrics' },
    { id: 'queue', label: '📋 Queue' },
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'premium', label: '⭐ Premium' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <header className="h-[54px] border-b border-white/5 bg-b0/90 backdrop-blur-md flex items-center gap-1.5 px-4 sticky top-0 shrink-0 z-20">
      {/* Mobile Hamburger Trigger */}
      <button
        onClick={onOpenMobileSidebar}
        className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:bg-white/5 hover:text-white shrink-0 mr-1 cursor-pointer"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Scrollable Navigation Shortcuts */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-p/15 text-p2 border border-p/20 shadow-inner'
                  : 'text-t3 hover:text-t2 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="h-4 w-[1px] bg-white/5 mx-2 shrink-0 hidden sm:block" />

      {/* Auxiliary Action Tools */}
      <div className="flex items-center gap-1 shrink-0 ml-auto pl-2">
        {/* Admin trigger shortcut */}
        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold text-y border border-y/20 bg-y/5 hover:bg-y/10 transition-all mr-1.5 cursor-pointer shrink-0 hidden sm:inline-flex items-center gap-1 animate-pulse"
          >
            <span>⚙️</span> Admin
          </button>
        )}

        {/* Speed cycler */}
        <button
          onClick={onCycleSpeed}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-t2 hover:bg-white/5 hover:text-white transition-all cursor-pointer shrink-0"
          title="Playback speed"
        >
          {speed}x
        </button>

        {/* Mini Player widget toggler */}
        <button
          onClick={onToggleMini}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:bg-white/5 hover:text-white transition-all cursor-pointer shrink-0"
          title="Toggle Mini-Player (P)"
        >
          <Music size={15} />
        </button>
      </div>
    </header>
  );
};
