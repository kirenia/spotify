import { Router } from "express";
import crypto from "node:crypto";
import { Token } from "../models/Token.js";
import { getValidToken } from "../services/spotifyToken.js";

const router = Router();

// states we've handed out, so the callback can check them
export const pendingStates = new Set();

router.get("/login", (req, res) => {
  // random string so nobody can fake the callback
  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.add(state);

  // everything spotify needs to know who we are and where to send the user back
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });

  // off to spotify to log in
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

router.get("/callback", async (req, res) => {
  // spotify sends us back here with a code (or an error)
  const { code, state, error } = req.query;

  // user hit cancel or something broke on spotify's end
  if (error) {
    return res
      .status(400)
      .json({ error: `Spotify authorization failed: ${error}` });
  }

  // make sure this state is one we actually handed out
  if (!state || !pendingStates.has(state)) {
    return res.status(400).json({ error: "Invalid or missing state" });
  }
  // one use only, toss it
  pendingStates.delete(state);

  // no code, no token
  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  // spotify wants client id + secret as base64 basic auth
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  try {
    // trade the code for real tokens
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
    });

    const data = await response.json();

    // spotify said no, pass along status and why
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error_description || data.error });
    }

    // spotify gives seconds until expiry, turn that into an actual date
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    // only ever keep one token, update it if it's already there
    const existing = await Token.findOne();
    if (existing) {
      await existing.update({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      });
    } else {
      await Token.create({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      });
    }

    console.log(`token saved, good until ${expiresAt.toLocaleTimeString()}`);

    // send the user back to the frontend
    res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    // couldn't even reach spotify
    console.error(err);
    res.status(502).json({ error: "Could not reach Spotify" });
  }
});

// tells the frontend if we need to show the login screen
router.get("/status", async (req, res) => {
  const token = await getValidToken();
  res.json({ loggedIn: Boolean(token) });
});

export default router;
