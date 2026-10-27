import { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Search from "./components/Search";
import { apiGet } from "./api";

function App() {
  // null = still checking, true/false once the backend answers
  const [loggedIn, setLoggedIn] = useState(null);

  // GET /auth/status - ask the backend if we have a good token
  useEffect(() => {
    apiGet("/auth/status")
      .then((data) => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  // still waiting on the backend
  if (loggedIn === null) {
    return (
      <>
        <Header />
        <main aria-busy="true" />
      </>
    );
  }

  // good token, straight to search
  if (loggedIn) {
    return <Search onAuthError={() => setLoggedIn(false)} />;
  }

  // no token, show the login screen
  return (
    <>
      <Header />
      <main>
        <Login />
      </main>
    </>
  );
}

export default App;
