const API_URL = import.meta.env.VITE_API_URL;

// shown when we don't have a token yet
export default function Login() {
  return (
    <section className="login">
      <h1>Please Login</h1>
      <p>In order to search for artists, albums, or songs you must login to your Spotify account</p>
      {/* kicks off the oauth flow on the backend */}
      <a className="btn" href={`${API_URL}/auth/login`}>
        Login
      </a>
    </section>
  );
}
