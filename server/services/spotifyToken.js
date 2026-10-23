import { Token } from "../models/Token.js";

// refresh a minute early so it doesn't die mid-request
const BUFFER_MS = 60 * 1000;

export async function getValidToken() {
  const token = await Token.findOne();

  // never logged in
  if (!token) return null;

  // still good, use it as is
  if (token.expiresAt.getTime() - BUFFER_MS > Date.now()) return token;

  // expired, trade the refresh token for a new one
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
  });

  const data = await response.json();

  // refresh failed, user has to log in again
  if (!response.ok) {
    console.error("token refresh failed:", data.error);
    return null;
  }

  // save the new one bc spotify doesn't always send a new refresh token
  await token.update({
    accessToken: data.access_token,
    refreshToken: data.refresh_token || token.refreshToken,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  });

  console.log("token refreshed");
  return token;
}
