import React from 'react';
import { Song } from '../types';

interface ShareModalProps {
  visible: boolean;
  song: Song | null;
  onClose: () => void;
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  song,
  onClose,
  onToast,
}) => {
  if (!visible || !song) return null;

  const handleShareTo = (platform: string) => {
    const text = encodeURIComponent(`🎵 Listening to "${song.title}" by ${song.artist} on WaveOS!`);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${text}`,
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`,
      spotify: `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
      onToast(`Opened ${platform} to share!`, 's');
    }
  };

  const copyLink = () => {
    const text = `🎵 "${song.title}" by ${song.artist} — WaveOS Music`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          onToast('Link copied to clipboard!', 's');
        })
        .catch(() => {
          onToast('Failed to copy. Try manual copy.', 'e');
        });
    } else {
      onToast('Copy: ' + text, 'i');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-b3 border border-white/10 rounded-3xl p-7 max-w-[400px] w-full shadow-2xl transform translate-y-0 transition-all">
        <h3 className="text-xl font-black text-t1 mb-1 font-outfit">Share Track 🔗</h3>
        <p className="text-xs text-t2 mb-6">
          "{song.title}" by {song.artist}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            onClick={() => handleShareTo('twitter')}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400 text-center transition-all cursor-pointer"
          >
            𝕏 Twitter
          </button>
          <button
            onClick={() => handleShareTo('facebook')}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/10 text-blue-400 text-center transition-all cursor-pointer"
          >
            Facebook
          </button>
          <button
            onClick={() => handleShareTo('whatsapp')}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 text-center transition-all cursor-pointer"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={() => handleShareTo('telegram')}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-center transition-all cursor-pointer"
          >
            ✈️ Telegram
          </button>
          <button
            onClick={copyLink}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-purple/20 bg-p/5 hover:bg-p/10 text-p2 text-center transition-all cursor-pointer"
          >
            🔗 Copy Link
          </button>
          <button
            onClick={() => handleShareTo('spotify')}
            className="py-3 px-4 rounded-xl text-xs font-bold border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 text-center transition-all cursor-pointer"
          >
            🎵 Spotify
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-xl text-xs font-semibold text-t2 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
