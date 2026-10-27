import { Router } from "express";
import { requireToken } from "../middleware/requireToken.js";

const router = Router();

// just the bits the frontend needs from each result
const simplify = (item, images) => ({
  id: item.id,
  name: item.name,
  image: images?.[0]?.url ?? null,
  url: item.external_urls.spotify,
});

// GET /api/search?q= - search spotify for artists, albums, and tracks
router.get("/search", requireToken, async (req, res) => {
  const q = req.query.q?.trim();

  // nothing to search for
  if (!q) {
    return res.status(400).json({ error: "Missing search query" });
  }

  // 4 of each to match the design
  const params = new URLSearchParams({
    q,
    type: "artist,album,track",
    limit: "4",
  });

  try {
    // GET from spotify - run the search with our token
    const response = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: { Authorization: `Bearer ${req.token.accessToken}` },
      },
    );

    const data = await response.json();

    // spotify said no, pass it along
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Spotify search failed" });
    }

    // spotify sometimes sends nulls in the list, skip those
    res.json({
      artists: data.artists.items
        .filter(Boolean)
        .map((a) => simplify(a, a.images)),
      albums: data.albums.items
        .filter(Boolean)
        .map((a) => simplify(a, a.images)),
      tracks: data.tracks.items
        .filter(Boolean)
        .map((t) => simplify(t, t.album.images)),
    });
  } catch (err) {
    // couldn't reach spotify
    console.error(err);
    res.status(502).json({ error: "Could not reach Spotify" });
  }
});

export default router;
