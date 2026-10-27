const API_URL = import.meta.env.VITE_API_URL;

// thrown when the backend says we're not logged in
export class AuthError extends Error {}

// GET helper for our backend, kicks us to login on a 401
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);

  if (res.status === 401) throw new AuthError("Not logged in");
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json();
}
