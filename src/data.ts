import { Song, Playlist, Friend } from './types';

export const INITIAL_SONGS: Song[] = [
  // Electronic
  {
    id: 1,
    title: 'Neon Drift',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Electric Dreams',
    dur: 214,
    plays: 2420000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']
  },
  {
    id: 2,
    title: 'Quantum Bloom',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Electric Dreams',
    dur: 195,
    plays: 1850000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']
  },
  {
    id: 3,
    title: 'Cobalt Rush',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Neon Horizon',
    dur: 201,
    plays: 1560000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3']
  },
  {
    id: 4,
    title: 'Solar Flare',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Neon Horizon',
    dur: 208,
    plays: 1890000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3']
  },
  {
    id: 5,
    title: 'Ultraviolet',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Electric Dreams',
    dur: 228,
    plays: 2200000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3']
  },
  // Ambient
  {
    id: 6,
    title: 'Crimson Skies',
    artist: 'Aurora Veil',
    genre: 'Ambient',
    album: 'Celestial',
    dur: 187,
    plays: 980000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3']
  },
  {
    id: 7,
    title: 'Aurora Phase',
    artist: 'Aurora Veil',
    genre: 'Ambient',
    album: 'Celestial',
    dur: 310,
    plays: 560000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3']
  },
  {
    id: 8,
    title: 'Frequency 440',
    artist: 'Aurora Veil',
    genre: 'Ambient',
    album: 'Signal',
    dur: 286,
    plays: 380000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3']
  },
  {
    id: 9,
    title: 'Velvet Orbit',
    artist: 'Aurora Veil',
    genre: 'Ambient',
    album: 'Signal',
    dur: 268,
    plays: 320000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3']
  },
  // Techno
  {
    id: 10,
    title: 'Midnight Protocol',
    artist: 'Digital Ghost',
    genre: 'Techno',
    album: 'Void Runner',
    dur: 241,
    plays: 3100000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3']
  },
  {
    id: 11,
    title: 'Phantom Signal',
    artist: 'Digital Ghost',
    genre: 'Techno',
    album: 'Void Runner',
    dur: 232,
    plays: 390000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3']
  },
  {
    id: 12,
    title: 'Infrared',
    artist: 'Digital Ghost',
    genre: 'Techno',
    album: 'Dark Matter',
    dur: 258,
    plays: 940000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3']
  },
  {
    id: 13,
    title: 'Synapse Fire',
    artist: 'Digital Ghost',
    genre: 'Techno',
    album: 'Dark Matter',
    dur: 245,
    plays: 730000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3']
  },
  {
    id: 14,
    title: 'Dusk Protocol',
    artist: 'Digital Ghost',
    genre: 'Techno',
    album: 'Void Runner',
    dur: 235,
    plays: 580000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3']
  },
  // Chillout
  {
    id: 15,
    title: 'Solar Wind',
    artist: 'Kosmik',
    genre: 'Chillout',
    album: 'Outer Rim',
    dur: 198,
    plays: 750000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3']
  },
  {
    id: 16,
    title: 'Deep Current',
    artist: 'Kosmik',
    genre: 'Chillout',
    album: 'Outer Rim',
    dur: 178,
    plays: 870000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3']
  },
  {
    id: 17,
    title: 'Ocean Drift',
    artist: 'Kosmik',
    genre: 'Chillout',
    album: 'Tidal',
    dur: 194,
    plays: 675000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']
  },
  {
    id: 18,
    title: 'Pacific Haze',
    artist: 'Kosmik',
    genre: 'Chillout',
    album: 'Tidal',
    dur: 221,
    plays: 460000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']
  },
  {
    id: 19,
    title: 'Golden Current',
    artist: 'Kosmik',
    genre: 'Chillout',
    album: 'Outer Rim',
    dur: 182,
    plays: 440000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3']
  },
  // Jazz
  {
    id: 20,
    title: 'Velvet Thunder',
    artist: 'Noir Coast',
    genre: 'Jazz',
    album: 'Rain Season',
    dur: 265,
    plays: 620000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3']
  },
  {
    id: 21,
    title: 'Starfall',
    artist: 'Noir Coast',
    genre: 'Jazz',
    album: 'Rain Season',
    dur: 248,
    plays: 490000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1446716336919-df838e44ce7e?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3']
  },
  {
    id: 22,
    title: 'Midnight Sax',
    artist: 'Noir Coast',
    genre: 'Jazz',
    album: 'Blue Hours',
    dur: 237,
    plays: 520000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1415886038695-ad2303ebe2af?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3']
  },
  {
    id: 23,
    title: 'Nocturn',
    artist: 'Noir Coast',
    genre: 'Jazz',
    album: 'Blue Hours',
    dur: 254,
    plays: 395000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3']
  },
  // Indie
  {
    id: 24,
    title: 'Glass Labyrinth',
    artist: 'Prism Break',
    genre: 'Indie',
    album: 'Refraction',
    dur: 223,
    plays: 430000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3']
  },
  {
    id: 25,
    title: 'Carbon Echo',
    artist: 'Prism Break',
    genre: 'Indie',
    album: 'Refraction',
    dur: 202,
    plays: 310000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3']
  },
  {
    id: 26,
    title: 'Crystal Spine',
    artist: 'Prism Break',
    genre: 'Indie',
    album: 'Refraction',
    dur: 199,
    plays: 170000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3']
  },
  // Folk
  {
    id: 27,
    title: 'Birch & Stone',
    artist: 'Prism Break',
    genre: 'Folk',
    album: 'Woodland',
    dur: 213,
    plays: 285000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3']
  },
  {
    id: 28,
    title: 'Ember Roads',
    artist: 'Prism Break',
    genre: 'Folk',
    album: 'Woodland',
    dur: 188,
    plays: 210000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3']
  },
  {
    id: 29,
    title: 'Mountain Echo',
    artist: 'Prism Break',
    genre: 'Folk',
    album: 'Woodland',
    dur: 196,
    plays: 160000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3']
  },
  // Lunar Static - Electronic
  {
    id: 30,
    title: 'Lunar Static',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    album: 'Neon Horizon',
    dur: 219,
    plays: 1120000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3']
  },
  // Dream Pop
  {
    id: 31,
    title: 'Violet Hours',
    artist: 'Luna Echo',
    genre: 'Dream Pop',
    album: 'Pastel Haze',
    dur: 205,
    plays: 820000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3']
  },
  {
    id: 32,
    title: 'Stardust Melody',
    artist: 'Luna Echo',
    genre: 'Dream Pop',
    album: 'Pastel Haze',
    dur: 193,
    plays: 650000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3']
  },
  {
    id: 33,
    title: 'Cipher',
    artist: 'Binary Waves',
    genre: 'Electronic',
    album: 'Hexcode',
    dur: 238,
    plays: 970000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']
  },
  {
    id: 34,
    title: 'Cascade',
    artist: 'Binary Waves',
    genre: 'Electronic',
    album: 'Hexcode',
    dur: 221,
    plays: 1340000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']
  },
  {
    id: 35,
    title: 'Raven & Rust',
    artist: 'Iron Bloom',
    genre: 'Alternative',
    album: 'Oxidized',
    dur: 252,
    plays: 440000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3']
  },
  {
    id: 36,
    title: 'Hollow Road',
    artist: 'Iron Bloom',
    genre: 'Alternative',
    album: 'Oxidized',
    dur: 277,
    plays: 330000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3']
  },
  {
    id: 37,
    title: 'Tide & Turn',
    artist: 'Coastal Drama',
    genre: 'Indie',
    album: 'Sea Level',
    dur: 218,
    plays: 290000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3']
  },
  {
    id: 38,
    title: 'Low Season',
    artist: 'Coastal Drama',
    genre: 'Indie',
    album: 'Sea Level',
    dur: 199,
    plays: 180000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3']
  },
  {
    id: 39,
    title: 'Prism City',
    artist: 'Neon Architects',
    genre: 'Synthpop',
    album: 'Blueprint',
    dur: 231,
    plays: 760000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3']
  },
  {
    id: 40,
    title: 'Glass Tower',
    artist: 'Neon Architects',
    genre: 'Synthpop',
    album: 'Blueprint',
    dur: 245,
    plays: 550000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3']
  },
  // New Tracks 41-50
  {
    id: 41,
    title: 'Neon Rain',
    artist: 'Tokyo Pulse',
    genre: 'Synthpop',
    album: 'City After Dark',
    dur: 223,
    plays: 1100000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3']
  },
  {
    id: 42,
    title: 'After Midnight',
    artist: 'Tokyo Pulse',
    genre: 'Synthpop',
    album: 'City After Dark',
    dur: 241,
    plays: 870000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3']
  },
  {
    id: 43,
    title: 'Desert Storm',
    artist: 'Red Horizon',
    genre: 'Electronic',
    album: 'Sandstorm',
    dur: 258,
    plays: 640000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3']
  },
  {
    id: 44,
    title: 'Mirage',
    artist: 'Red Horizon',
    genre: 'Electronic',
    album: 'Sandstorm',
    dur: 199,
    plays: 490000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3']
  },
  {
    id: 45,
    title: 'Slow Burn',
    artist: 'Ember Falls',
    genre: 'R&B',
    album: 'Velvet Season',
    dur: 234,
    plays: 1380000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1415886038695-ad2303ebe2af?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3']
  },
  {
    id: 46,
    title: 'Golden Hour',
    artist: 'Ember Falls',
    genre: 'R&B',
    album: 'Velvet Season',
    dur: 207,
    plays: 1650000,
    liked: true,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3']
  },
  {
    id: 47,
    title: 'Frozen Lake',
    artist: 'Polar Sound',
    genre: 'Ambient',
    album: 'Arctic Drift',
    dur: 312,
    plays: 420000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3']
  },
  {
    id: 48,
    title: 'Aurora Borealis',
    artist: 'Polar Sound',
    genre: 'Ambient',
    album: 'Arctic Drift',
    dur: 287,
    plays: 560000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3']
  },
  {
    id: 49,
    title: 'Rebel Signal',
    artist: 'Static Throne',
    genre: 'Rock',
    album: 'High Voltage',
    dur: 245,
    plays: 920000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']
  },
  {
    id: 50,
    title: 'Thunder Road',
    artist: 'Static Throne',
    genre: 'Rock',
    album: 'High Voltage',
    dur: 263,
    plays: 780000,
    liked: false,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&q=80',
    urls: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']
  }
];

export const LYRICS: Record<number, string[]> = {
  1: [
    '🎵 Neon lights pulse through the night',
    'Electric dreams burning bright',
    'Synthwave echoes fill the air',
    'Lost in frequencies beyond compare',
    '',
    '🎵 Drift along the neon stream',
    'Reality fades like a dream',
    'The rhythm guides my restless soul',
    'Bass drops deep like a wishing hole',
    '',
    '🔮 Synthesizers paint the dark',
    'Every beat a glowing spark',
    'Time dissolves in the machine',
    'The future glows between the seams'
  ],
  6: [
    '🌅 Crimson skies above the clouds',
    'Where the silence speaks so loud',
    'Aurora dancing, painting night',
    'Celestial colors burning bright',
    '',
    '🌅 I drift along the cosmic sea',
    'Stars are whispering to me',
    'Through the velvet depths I soar',
    'To the place I lived before'
  ],
  10: [
    '💻 Midnight Protocol initiates',
    'System override — data awaits',
    'Digital ghost in the machine',
    'Chasing signals in between',
    '',
    '💻 Encrypted in the dark web flow',
    'No trace of where my secrets go',
    'Firewall broken, systems fall',
    'Midnight protocol controls us all'
  ],
  5: [
    '🔮 Ultraviolet, can\'t be seen',
    'Colors bleeding in between',
    'Beyond the spectrum of the known',
    'A frequency you feel alone',
    '',
    '🔮 Invisible, yet so alive',
    'On frequencies where thoughts survive'
  ],
  17: [
    '🌊 Ocean drift on a sea of sound',
    'Tidal rhythms that swirl around',
    'Salt in the air and breeze in my hair',
    'Floating away without a care',
    '',
    '🌊 The current takes me where it flows',
    'Through the deep where the blue light glows'
  ],
  4: [
    '☀️ Solar flare ignites the dawn',
    'Burning bright from dusk to drawn',
    'Photon waves hit atmosphere',
    'Plasma dancing, ever near',
    '',
    '☀️ Magnetic storms on distant plains',
    'Coronal loops and ion rains'
  ],
  31: [
    '🌸 Violet hours drift by slow',
    'In a haze of indigo',
    'Your voice a soft and gentle wave',
    'Washing over all I crave',
    '',
    '🌸 Pastel skies and neon dreams',
    'Nothing is quite what it seems'
  ],
  33: [
    '🔐 Cipher locked in binary',
    'Every secret runs through me',
    'Decode the message, break the wall',
    'Underneath the firewall',
    '',
    '🔐 Hidden words in streams of light',
    'Data pulses through the night'
  ],
  39: [
    '🏙️ Prism city on the bay',
    'Neon towers light the way',
    'Chrome and glass reflect the moon',
    'Every street a different tune',
    '',
    '🏙️ Architect of dreams and steel',
    'Only music makes it real'
  ],
  45: [
    '🔥 Slow burn through the evening air',
    'Your voice like smoke without a care',
    'We\'re melting into something real',
    'A warmth I\'ve never learned to feel',
    '',
    '🔥 Golden embers, fading light',
    'Two shadows dancing through the night'
  ],
  46: [
    '✨ Golden hour on the rooftop',
    'Time is standing still, won\'t stop',
    'Your laughter catches in the breeze',
    'Warm and golden, effortless ease',
    '',
    '✨ Every moment painted gold',
    'A story waiting to be told'
  ],
  48: [
    '❄️ Northern lights above the snow',
    'A thousand colors in the glow',
    'The frozen world stands still and waits',
    'For dawn to open heaven\'s gates',
    '',
    '❄️ Aurora dancing in the dark',
    'A silent fire, an ancient spark'
  ],
  49: [
    '⚡ Static in the wires tonight',
    'Rebel signal burning bright',
    'Turn it up until it bleeds',
    'Rock and roll is all you need',
    '',
    '⚡ Thunder in the amplifier',
    'We are made of electric fire'
  ]
};

export const INITIAL_PLAYLISTS: Playlist[] = [
  { id: 1, name: 'Deep Focus', songs: [1, 3, 10, 30, 33, 4], desc: 'Zone in', pub: true },
  { id: 2, name: 'Night Drive', songs: [6, 15, 20, 22, 23], desc: 'Late night vibes', pub: true },
  { id: 3, name: 'Chill Vibes', songs: [7, 16, 17, 18, 9], desc: 'Relax & unwind', pub: false },
  { id: 4, name: 'Workout', songs: [10, 12, 13, 5, 14], desc: 'Push your limits', pub: true },
  { id: 5, name: 'Jazz Lounge', songs: [20, 21, 22, 23], desc: 'Smooth & soulful', pub: false },
  { id: 6, name: 'New Wave', songs: [31, 32, 39, 40, 34], desc: 'Fresh discoveries', pub: true },
  { id: 7, name: 'R&B Vibes', songs: [45, 46], desc: 'Smooth & soulful R&B', pub: true },
  { id: 8, name: 'Rock Out', songs: [49, 50], desc: 'High voltage rock', pub: true }
];

export const FRIENDS: Friend[] = [
  {
    name: 'Sarah K.',
    av: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    song: 'Neon Drift',
    artist: 'Synthwave Collective',
    online: true
  },
  {
    name: 'Marco R.',
    av: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    song: 'Solar Wind',
    artist: 'Kosmik',
    online: true
  },
  {
    name: 'Priya M.',
    av: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face',
    song: 'Deep Current',
    artist: 'Kosmik',
    online: false
  },
  {
    name: 'Lena T.',
    av: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    song: 'Aurora Phase',
    artist: 'Aurora Veil',
    online: true
  },
  {
    name: 'Dev S.',
    av: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    song: 'Midnight Protocol',
    artist: 'Digital Ghost',
    online: false
  },
  {
    name: 'Aisha P.',
    av: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    song: 'Crimson Skies',
    artist: 'Aurora Veil',
    online: true
  }
];
