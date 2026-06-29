import React from 'react';
import { Compass, Music, ShieldCheck } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'user' | 'admin') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="fixed inset-0 z-[9000] bg-b0 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
      {/* Dynamic Back Orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-p/10 blur-[80px] pointer-events-none animate-orb1" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-c/10 blur-[80px] pointer-events-none animate-orb2" />

      {/* Brand Launcher Logo */}
      <div className="flex items-center gap-3.5 mb-2 relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-p to-c flex items-center justify-center shadow-2xl shadow-p/40">
          <Compass size={24} className="text-white" />
        </div>
        <div>
          <div className="font-extrabold text-2xl text-t1 font-outfit leading-none tracking-tight">WaveOS</div>
          <div className="text-[10px] font-bold tracking-widest text-p2 uppercase mt-[3.5px]">v5 Ultra</div>
        </div>
      </div>

      <div className="text-xs text-t3 font-medium mb-12 tracking-wide font-display relative">
        Select your musical profile context
      </div>

      {/* Choice Grid */}
      <div className="flex gap-5 flex-wrap justify-center max-w-[560px] px-6 w-full relative">
        {/* User Card */}
        <div
          onClick={() => onSelectRole('user')}
          className="group bg-b2/40 border border-white/5 hover:border-p2/40 hover:shadow-2xl hover:shadow-p/10 hover:bg-b2/80 rounded-3xl p-7 w-[230px] cursor-pointer text-center transition-all duration-300 transform hover:-translate-y-1.5"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-p/20 to-c/10 border border-p/30 flex items-center justify-center mx-auto mb-4 text-3xl transition-transform duration-300 group-hover:scale-105">
            🎧
          </div>
          <h4 className="font-extrabold text-base text-t1 mb-1.5 font-outfit">Listener</h4>
          <p className="text-xs text-t2 leading-relaxed mb-6">
            Browse, play, and discover music. Complete access to players and AI playlists.
          </p>
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-p to-c text-white font-bold text-xs rounded-full font-outfit shadow-md group-hover:scale-105 active:scale-95 transition-all">
            Continue listening
          </div>
        </div>

        {/* Admin Card */}
        <div
          onClick={() => onSelectRole('admin')}
          className="group bg-b2/40 border border-white/5 hover:border-y/40 hover:shadow-2xl hover:shadow-y/10 hover:bg-b2/80 rounded-3xl p-7 w-[230px] cursor-pointer text-center transition-all duration-300 transform hover:-translate-y-1.5"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-y/20 to-pi/10 border border-y/30 flex items-center justify-center mx-auto mb-4 text-3xl transition-transform duration-300 group-hover:scale-105">
            ⚙️
          </div>
          <h4 className="font-extrabold text-base text-t1 mb-1.5 font-outfit flex items-center justify-center gap-1">
            Admin 
            <ShieldCheck size={14} className="text-y" />
          </h4>
          <p className="text-xs text-t2 leading-relaxed mb-6">
            Unlock administrative privileges. Add custom songs, manage the database, see library stats.
          </p>
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-y to-pi text-white font-bold text-xs rounded-full font-outfit shadow-md group-hover:scale-105 active:scale-95 transition-all">
            Open administrative dashboard
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-t4 font-mono">
        WaveOS v5 Ultra · Premium Client Sandbox Mode
      </div>
    </div>
  );
};
