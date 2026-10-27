import { getValidToken } from "../services/spotifyToken.js";

// blocks any route that needs spotify if we don't have a good token
export async function requireToken(req, res, next) {
  // READ - get a good token (refreshes it if it expired)
  const token = await getValidToken();

  // no token or refresh failed, go log in
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  // hand the token to the route
  req.token = token;
  next();
}
