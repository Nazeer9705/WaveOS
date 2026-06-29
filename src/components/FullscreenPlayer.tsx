import React from 'react';
import { Song, PlaybackRepeat } from '../types';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, X, VolumeX, Volume2 } from 'lucide-react';
import { PlaybackSlider } from './PlaybackSlider';

interface FullscreenPlayerProps {
  visible: boolean;
  song: Song | null;
  isPlaying: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  repeat: PlaybackRepeat;
  onCycleRepeat: () => void;
  onLikeToggle: (id: number) => void;
  volume: number;
  onSetVolume: (v: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (pct: number) => void;
}

export const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({
  visible,
  song,
  isPlaying,
  onClose,
  onTogglePlay,
  onNext,
  onPrev,
  shuffle,
  onToggleShuffle,
  repeat,
  onCycleRepeat,
  onLikeToggle,
  volume,
  onSetVolume,
  currentTime,
  duration,
  onSeek,
}) => {
  if (!visible || !song) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[999] bg-b0 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden animate-in fade-in duration-300">
      {/* Blurred Backdrop of active cover */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-[90px] brightness-[0.22] saturate-[1.8] scale-110 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${song.cover})` }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all cursor-pointer z-10 hover:scale-105 active:scale-95"
      >
        <X size={18} />
      </button>

      {/* Main Container wrapper */}
      <div className="relative z-10 flex flex-col items-center gap-7 max-w-[380px] w-full text-center">
        {/* artwork with glow shadows */}
        <div className="relative group select-none">
          <img
            src={song.cover}
            alt=""
            className={`w-[270px] h-[270px] rounded-3xl object-cover shadow-2xl transition-all duration-300 ${
              isPlaying ? 'scale-101 shadow-p/20 ring-4 ring-p/10' : 'scale-98 shadow-black/80'
            }`}
          />
          {/* Heart overlay */}
          <button
            onClick={() => onLikeToggle(song.id)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          >
            <Heart
              size={15}
              fill={song.liked ? 'var(--color-pi)' : 'none'}
              stroke={song.liked ? 'var(--color-pi)' : 'currentColor'}
              className={song.liked ? 'text-pi' : 'text-t2'}
            />
          </button>
        </div>

        {/* Info */}
        <div className="w-full">
          <h3 className="text-xl sm:text-2xl font-black text-white truncate font-outfit tracking-tight leading-tight">
            {song.title}
          </h3>
          <p className="text-sm text-white/60 truncate mt-1">{song.artist}</p>
        </div>

        {/* Playback Progress Slider */}
        <PlaybackSlider
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          variant="fullscreen"
        />

        {/* Buttons Controls bar */}
        <div className="flex items-center gap-5 justify-center">
          <button
            onClick={onToggleShuffle}
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer ${
              shuffle ? 'text-p2 font-bold' : 'text-white/65'
            }`}
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={onPrev}
            className="w-11 h-11 rounded-full text-white/75 hover:text-white flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 bg-white text-b0 hover:scale-107 active:scale-95 flex items-center justify-center rounded-full shadow-2xl transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={25} fill="currentColor" className="text-b0" />
            ) : (
              <Play size={25} fill="currentColor" className="ml-1 text-b0" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-11 h-11 rounded-full text-white/75 hover:text-white flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-white/5 transition-all cursor-pointer ${
              repeat !== 'none' ? 'text-p2 font-bold' : 'text-white/65'
            }`}
          >
            <Repeat size={18} />
            {repeat === 'one' && (
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-p2 rounded-full shadow-lg" />
            )}
          </button>
        </div>

        {/* Fullscreen Volume slider row */}
        <div className="w-full flex items-center gap-3 mt-3 px-4">
          <button
            onClick={() => onSetVolume(volume > 0 ? 0 : 0.8)}
            className="text-white/40 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume * 100}
            onChange={(e) => onSetVolume(Number(e.target.value) / 100)}
            className="flex-1 h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all appearance-none"
          />
        </div>
      </div>
    </div>
  );
};
