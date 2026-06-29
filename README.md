# 🌊 WaveOS

> **A premium, high-fidelity music streaming and discovery experience.** 
> Styled with a glassmorphic dark theme, gorgeous responsive components, smooth animations, and advanced browser capabilities.

---

## ✨ Features Overview

### 🎵 High-Fidelity Audio Core
*   **Web Audio Synth Support:** Built-in ambient client-side synthesizers that dynamically generate melodic fallback sounds when tracks are offline.
*   **Premium Interactive Playback Slider:** Custom-crafted range inputs in the footer and Fullscreen player that offer buttery-smooth hover transitions, active thumb scaling, and exact floating scrubbing tooltips.

### 💾 Local Storage & Browser Databases
*   **IndexedDB File Storage:** Upload your own MP3/WAV/M4A files directly from the Admin Panel. Audio files are saved inside a persistent browser database and loaded securely as local blob URLs when played.
*   **Persistent Custom State:** Your customized playlists, favorite tracks, liked songs, history, and preferences are fully saved to `localStorage` across visits.

### 🎨 Craftsmanship & UI
*   **Glassmorphic Aesthetic:** Beautifully designed deep dark layouts with ambient background glows matching the current playing song cover art.
*   **Fluid Responsive Transitions:** Transitions, micro-interactions, and visual feedback designed directly with React and Tailwind CSS.
*   **Fullscreen Immersive Player:** A dedicated full-view cinematic player interface featuring high-contrast controls, hearting tracks, volume knobs, and advanced seeking.

---

## 🛠️ Architecture & Technologies

- **Frontend Core:** React 18+ with Vite & TypeScript
- **Styling Engine:** Tailwind CSS 4.0 with customized CSS theme variables
- **Local Persistence:** 
  - **IndexedDB** (`src/lib/indexedDb.ts`) for storing binary audio track blobs
  - **Local Storage** for user settings, playlist creations, and profile states
- **Audio Engine:** HTML5 `Audio` coupled with a custom modular `AudioService` (`src/lib/audioService.ts`) for seamless playbacks, track buffering, and clean lifecycle event management
- **Icons:** Premium outline icons by `lucide-react`

---

## 🚀 Getting Started

### 📦 Installation
First, install all development and runtime dependencies:
```bash
npm install
```

### ⚡ Start Development Server
Launch the Vite development environment on port 3000:
```bash
npm run dev
```

### 🏗️ Production Build
To bundle the client-side SPA ready for static hosting and fast browser loading:
```bash
npm run build
```

---

## 📂 Project Structure

```text
├── src/
│   ├── components/            # Modular UI Components
│   │   ├── PlaybackSlider.tsx # Interactive Scrubbing Slider
│   │   ├── AdminPanelModal.tsx# Drag-and-drop Audio File Upload Portal
│   │   ├── FullscreenPlayer.tsx# Cinematic Full-screen playback controls
│   │   └── ...
│   ├── lib/
│   │   ├── audioService.ts    # Audio playback engine & event manager
│   │   └── indexedDb.ts       # Database helper for binary storage
│   ├── types.ts               # Strict TypeScript definitions
│   └── main.tsx               # Primary mounting element
├── metadata.json              # Applet metadata
└── package.json               # NPM configuration
```

---

*Crafted with 💖 for a beautiful music streaming experience.*
