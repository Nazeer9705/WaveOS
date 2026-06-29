import React from 'react';
import { Playlist } from '../types';
import { 
  Home, 
  Search, 
  Smile, 
  FolderHeart, 
  ListMusic, 
  Mic2, 
  User, 
  BarChart2, 
  Sparkles, 
  Settings, 
  Lock,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  playlists: Playlist[];
  onPlayPlaylist: (id: number) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onCloseMobile: () => void;
  sidebarOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  playlists,
  onPlayPlaylist,
  isAdmin,
  onOpenAdmin,
  onCloseMobile,
  sidebarOpen,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'mood', label: 'Mood AI', icon: Smile, badge: 'NEW' },
  ];

  const libraryItems = [
    { id: 'library', label: 'Library', icon: FolderHeart },
    { id: 'queue', label: 'Queue', icon: ListMusic },
    { id: 'lyrics', label: 'Lyrics', icon: Mic2 },
  ];

  const personalItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'premium', label: 'Premium', icon: Sparkles, pro: true },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`w-[260px] bg-b1 border-r border-white/5 flex flex-col h-full shrink-0 transition-transform duration-300 ease-out z-50 md:z-10 md:static fixed top-0 bottom-0 left-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-[18px] border-b border-white/5 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-p to-c flex items-center justify-center shrink-0 shadow-lg shadow-p/20 animate-pulse-slow">
            <Compass size={18} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base text-t1 font-outfit leading-none tracking-tight">WaveOS</div>
            <div className="text-[9px] font-bold tracking-widest text-p2 uppercase mt-[3px]">v5 Ultra</div>
          </div>
        </div>

        {/* Scrollable Nav Tree */}
        <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-4">
          
          {/* Section: Discover */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold tracking-widest text-t3 uppercase px-3 py-1.5 font-outfit">Discover</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onCloseMobile(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium text-left transition-all ${
                    isActive 
                      ? 'bg-p/15 text-p2 font-bold shadow-sm shadow-p/5' 
                      : 'text-t3 hover:bg-white/5 hover:text-t2'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-p2' : 'opacity-75'} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[8.5px] font-black bg-p/20 text-p2 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: Library */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold tracking-widest text-t3 uppercase px-3 py-1.5 font-outfit">Library</div>
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onCloseMobile(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium text-left transition-all ${
                    isActive 
                      ? 'bg-p/15 text-p2 font-bold shadow-sm shadow-p/5' 
                      : 'text-t3 hover:bg-white/5 hover:text-t2'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-p2' : 'opacity-75'} />
                  <span className="flex-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: You */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold tracking-widest text-t3 uppercase px-3 py-1.5 font-outfit">You</div>
            {personalItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onCloseMobile(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium text-left transition-all ${
                    isActive 
                      ? 'bg-p/15 text-p2 font-bold shadow-sm shadow-p/5' 
                      : 'text-t3 hover:bg-white/5 hover:text-t2'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-p2' : 'opacity-75'} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.pro && (
                    <span className="text-[8.5px] font-black bg-y/15 text-y px-2 py-0.5 rounded-full uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </button>
              );
            })}

            {/* Special Administrative Button if Admin */}
            {isAdmin && (
              <button
                onClick={() => { onOpenAdmin(); onCloseMobile(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-semibold text-left text-y hover:bg-y/10 hover:text-y transition-all border border-y/10 bg-y/5 mt-2 cursor-pointer"
              >
                <Lock size={15} className="text-y animate-pulse" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => { onNavigate('settings'); onCloseMobile(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium text-left transition-all mt-1 ${
                currentView === 'settings' 
                  ? 'bg-p/15 text-p2 font-bold' 
                  : 'text-t3 hover:bg-white/5 hover:text-t2'
              }`}
            >
              <Settings size={16} className={currentView === 'settings' ? 'text-p2' : 'opacity-75'} />
              <span className="flex-1 truncate">Settings</span>
            </button>
          </div>

          {/* Section: Saved playlists shortcut */}
          {playlists.length > 0 && (
            <div className="space-y-1 pt-1.5 border-t border-white/5">
              <div className="text-[10px] font-bold tracking-widest text-t3 uppercase px-3 py-1 font-outfit">Playlists</div>
              <div className="space-y-0.5 max-h-[180px] overflow-y-auto">
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => { onPlayPlaylist(pl.id); onCloseMobile(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-t2 hover:bg-white/5 hover:text-white transition-all text-left truncate"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-p/60 shrink-0" />
                    <span className="truncate">{pl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge Footer */}
        <div className="p-3 border-t border-white/5 flex items-center gap-3 shrink-0 bg-b0/20">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
            alt="Alex Rivera avatar"
            className="w-8 h-8 rounded-full border border-p2/30 object-cover bg-b4"
          />
          <div className="min-w-0">
            <div className="text-[12.5px] font-bold text-t1 leading-none truncate font-outfit">Alex Rivera</div>
            <div className="text-[9.5px] font-semibold text-y mt-[3px] flex items-center gap-1 font-outfit">
              <span>⭐</span> Ultra Member
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
