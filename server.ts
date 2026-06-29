import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Load the song dataset to pass to Gemini as context
import { INITIAL_SONGS } from "./src/data.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client utility
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // ── API ROUTES FIRST ──
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // AI-Powered Mood Playlist builder
  app.post("/api/mood", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!ai) {
      // Fallback: If no Gemini API key, do a smart local keyword filter
      console.warn("Gemini API key not configured or is placeholder. Using smart keyword filter fallback.");
      const localPlaylist = generateLocalFallbackPlaylist(prompt);
      return res.json(localPlaylist);
    }

    try {
      // Create schema for JSON output
      const playlistSchema = {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "A creative, premium name for the playlist reflecting the mood.",
          },
          desc: {
            type: Type.STRING,
            description: "A poetic or engaging description of this specific musical vibe.",
          },
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.INTEGER,
            },
            description: "An array of song IDs (integers between 1 and 50) that best fit this mood.",
          },
        },
        required: ["name", "desc", "songs"],
      };

      const systemPrompt = `You are the WaveOS AI Music Curator. Your job is to create a personalized, premium playlist based on the user's mood, feelings, or activity.
Below is the list of all available songs in our music catalog with their IDs, titles, artists, and genres.
Analyze the user's prompt carefully, decide which tracks match the vibe, and generate a customized playlist containing 4 to 12 matching song IDs.

Music Catalog:
${INITIAL_SONGS.map(s => `ID: ${s.id} | Title: "${s.title}" | Artist: "${s.artist}" | Genre: "${s.genre}"`).join("\n")}

Respond STRICTLY in JSON format matching the schema requested. Make sure the 'songs' array contains ONLY valid IDs from the list above.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `I am feeling or doing this: "${prompt}". Build me a customized playlist.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: playlistSchema,
          temperature: 1.0,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }

      const playlistData = JSON.parse(responseText.trim());
      // Validate song IDs are actual numbers and correspond to real songs
      playlistData.songs = (playlistData.songs || [])
        .map((id: any) => Number(id))
        .filter((id: number) => !isNaN(id) && id >= 1 && id <= 50);

      if (playlistData.songs.length === 0) {
        playlistData.songs = [1, 6, 15, 20]; // safe default
      }

      res.json(playlistData);
    } catch (error: any) {
      console.error("Gemini Mood AI Error:", error);
      // Fallback on error
      const localPlaylist = generateLocalFallbackPlaylist(prompt);
      res.json(localPlaylist);
    }
  });

  // ── VITE MIDDLEWARE IN DEV / STATIC IN PROD ──
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[WaveOS] Server listening on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

// Smart keyword matching for fallback playlist creation
function generateLocalFallbackPlaylist(prompt: string) {
  const p = prompt.toLowerCase();
  let selectedGenres: string[] = [];
  let name = "Wave Custom Mix";
  let desc = `Curated especially for your vibe: "${prompt}"`;

  if (p.includes("focus") || p.includes("study") || p.includes("work") || p.includes("code")) {
    selectedGenres = ["Ambient", "Chillout"];
    name = "Neural Flow State";
    desc = "Deep ambient frequencies and low-fi patterns to lock in your concentration.";
  } else if (p.includes("sleep") || p.includes("relax") || p.includes("calm") || p.includes("bed") || p.includes("night")) {
    selectedGenres = ["Ambient", "Dream Pop", "Chillout"];
    name = "Drifting Into Dreams";
    desc = "Warm analog textures, soft keys, and quiet acoustic landscapes to calm the mind.";
  } else if (p.includes("run") || p.includes("gym") || p.includes("workout") || p.includes("exercise") || p.includes("energy") || p.includes("power")) {
    selectedGenres = ["Techno", "Electronic"];
    name = "Adrenaline Overdrive";
    desc = "High-velocity industrial kicks and cutting synth lines to fuel your peak physical output.";
  } else if (p.includes("happy") || p.includes("joy") || p.includes("bright") || p.includes("fun") || p.includes("dance")) {
    selectedGenres = ["Synthpop", "Electronic", "Dream Pop"];
    name = "Sun-Drenched Beats";
    desc = "Optimistic analog melodies and driving, rhythmic loops to elevate your spirit.";
  } else if (p.includes("sad") || p.includes("rain") || p.includes("lonely") || p.includes("melancholy") || p.includes("blue")) {
    selectedGenres = ["Jazz", "Folk", "Alternative"];
    name = "Raindrop Reflections";
    desc = "Sorrowful brass, warm wood, and delicate lyrics for moments of quiet introspection.";
  } else if (p.includes("party") || p.includes("club") || p.includes("rave") || p.includes("dance")) {
    selectedGenres = ["Techno", "Electronic", "Synthpop"];
    name = "Strobe Light Sanctuary";
    desc = "Peak hour dance floor fillers and retro-futuristic club rhythms.";
  } else {
    // General keyword extraction
    const genres = ["Electronic", "Ambient", "Techno", "Chillout", "Jazz", "Indie", "Folk", "Dream Pop", "Synthpop", "Alternative", "R&B", "Rock"];
    const matched = genres.filter(g => p.includes(g.toLowerCase()));
    if (matched.length > 0) {
      selectedGenres = matched;
      name = `${matched[0]} Vibe Session`;
    } else {
      selectedGenres = ["Chillout", "Electronic", "Ambient", "Indie"];
      name = "Cosmic Sync Mix";
    }
  }

  // Pick matching songs
  const matchedSongs = INITIAL_SONGS.filter(s => selectedGenres.includes(s.genre));
  const shuffled = [...matchedSongs].sort(() => Math.random() - 0.5);
  const songs = shuffled.slice(0, 8).map(s => s.id);

  return { name, desc, songs };
}

startServer();
