import React, { useState, useEffect, useRef } from 'react';

interface PlaybackSliderProps {
  currentTime: number;
  duration: number;
  onSeek: (pct: number) => void;
  variant?: 'footer' | 'fullscreen';
}

export const PlaybackSlider: React.FC<PlaybackSliderProps> = ({
  currentTime,
  duration,
  onSeek,
  variant = 'footer',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize internal dragValue when not actively dragging
  useEffect(() => {
    if (!isDragging) {
      setDragValue(currentTime);
    }
  }, [currentTime, isDragging]);

  const activeValue = isDragging ? dragValue : currentTime;
  const progressPct = duration > 0 ? (activeValue / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDragValue(val);
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (duration > 0) {
      onSeek(dragValue / duration);
    }
  };

  // Inline CSS background representing the filled progress portion beautifully
  const backgroundStyle = {
    background: `linear-gradient(to right, var(--color-p) 0%, var(--color-c) ${progressPct}%, rgba(255, 255, 255, 0.1) ${progressPct}%, rgba(255, 255, 255, 0.1) 100%)`,
  };

  const textStyle = variant === 'fullscreen' ? 'text-white/60 font-semibold' : 'text-t3';

  return (
    <div 
      ref={containerRef}
      className="w-full flex flex-col gap-1.5 relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDragging) setIsHovered(false);
      }}
    >
      {/* Floating Scrubbing Tooltip */}
      {(isDragging || (isHovered && duration > 0)) && (
        <div 
          className="absolute -top-8 px-2 py-1 bg-b3 border border-white/10 rounded-lg text-[10px] font-mono text-t1 shadow-xl pointer-events-none transition-all z-20"
          style={{ 
            left: `${Math.max(4, Math.min(96, progressPct))}%`,
            transform: 'translateX(-50%)'
          }}
        >
          {formatTime(activeValue)}
        </div>
      )}

      {/* Main Slider Wrapper */}
      <div className="flex items-center gap-2.5 w-full">
        {/* Time - Left */}
        <span className={`w-8 text-right text-[10px] font-mono ${textStyle}`}>
          {formatTime(activeValue)}
        </span>

        {/* Draggable Track Container */}
        <div className="flex-1 relative flex items-center group py-2">
          {/* Track Underlay */}
          <div 
            className={`absolute left-0 right-0 rounded-full bg-white/10 group-hover:h-1.5 h-1 transition-all pointer-events-none overflow-hidden`}
            style={{ borderRadius: '9999px' }}
          >
            {/* Custom filled visual overlay */}
            <div 
              className="h-full bg-gradient-to-r from-p to-c rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Real Transparent Draggable Input */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={activeValue}
            onChange={handleInputChange}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            className="premium-slider absolute inset-x-0 w-full opacity-100 h-6 bg-transparent"
            style={{
              WebkitAppearance: 'none',
              // hide default track visual, keeping thumb interactive
            }}
          />
        </div>

        {/* Time - Right */}
        <span className={`w-8 text-left text-[10px] font-mono ${textStyle}`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
