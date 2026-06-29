export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  album: string;
  dur: number; // duration in seconds
  plays: number;
  liked: boolean;
  cover: string;
  urls: string[];
  adminAdded?: boolean;
}

export interface Playlist {
  id: number;
  name: string;
  songs: number[]; // song IDs
  desc: string;
  pub: boolean;
}

export interface Friend {
  name: string;
  av: string;
  song: string;
  artist: string;
  online: boolean;
}

export type PlaybackRepeat = 'none' | 'all' | 'one';

export interface UserStats {
  likedCount: number;
  playedCount: number;
  playlistCount: number;
  dayStreak: number;
}
