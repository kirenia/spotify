import { Token } from "../models/Token.js";

// this blocks any route that needs spotify if we don't have a token
export async function requireToken(req, res, next) {
  const token = await Token.findOne();

  // no token, no entry!!
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  // hand the token to the route
  req.token = token;
  next();
}
