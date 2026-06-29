import React from 'react';
import { Song } from '../types';
import { SongRow } from './SongRow';
import { ListMusic, Shuffle, Save, Trash2, ArrowUpRight } from 'lucide-react';

interface ViewQueueProps {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, queue: Song[], index: number) => void;
  onLikeToggle: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, song: Song) => void;
  onClearQueue: () => void;
  onShuffleQueue: () => void;
  onSaveQueueAsPlaylist: () => void;
  onLoadAllSongsToQueue: () => void;
}

export const ViewQueue: React.FC<ViewQueueProps> = ({
  queue,
  currentSong,
  isPlaying,
  onPlaySong,
  onLikeToggle,
  onContextMenu,
  onClearQueue,
  onShuffleQueue,
  onSaveQueueAsPlaylist,
  onLoadAllSongsToQueue,
}) => {
  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      
      {/* Queue Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-black tracking-widest text-t3 uppercase font-outfit">Active Playback Queue</h3>
          <p className="text-[11px] text-t3 font-bold mt-1 uppercase">
            {queue.length} track{queue.length !== 1 ? 's' : ''} in backup flow
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onLoadAllSongsToQueue}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-t2 hover:text-white transition-all cursor-pointer"
            title="Load full 50 songs catalog"
          >
            <ArrowUpRight size={13} /> + Catalog
          </button>
          <button
            onClick={onShuffleQueue}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-t2 hover:text-white transition-all cursor-pointer"
          >
            <Shuffle size={13} /> Shuffle
          </button>
          <button
            onClick={onSaveQueueAsPlaylist}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-t2 hover:text-white transition-all cursor-pointer"
          >
            <Save size={13} /> Save
          </button>
          <button
            onClick={onClearQueue}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Queue Track List */}
      {queue.length > 0 ? (
        <div className="space-y-0.5 bg-b2/20 border border-white/5 p-4 rounded-3xl animate-in fade-in duration-200">
          {queue.map((song, i) => (
            <SongRow
              key={`${song.id}-${i}`}
              song={song}
              index={i}
              isPlaying={isPlaying}
              isCurrent={currentSong?.id === song.id}
              onPlay={(s) => onPlaySong(s, queue, i)}
              onLikeToggle={onLikeToggle}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-b2/10 rounded-3xl border border-white/5">
          <div className="text-5xl mb-4">📋</div>
          <h4 className="text-sm font-bold text-t1 mb-1">Queue is empty</h4>
          <p className="text-xs text-t3 max-w-[280px] mx-auto leading-relaxed mt-1">
            Click "+ Catalog" above to load the full catalog, or select a song from Home or Search to fill the queue.
          </p>
        </div>
      )}
    </div>
  );
};
