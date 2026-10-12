import { Router } from "express";
import crypto from "node:crypto";

const router = Router();

// tracks issued state values so callback can verify them
export const pendingStates = new Set();

router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.add(state);

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

export default router;
