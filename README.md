# Spotify Search

A full stack music search app built for Project and Portfolio III at Full Sail University. Users log in with their Spotify account, then search for artists, albums, and songs. Each result links to the Spotify web player.

## Project Overview

### Features

- Spotify OAuth login using the Authorization Code flow
- Access and refresh tokens (JWT) persisted in a SQLite database
- Automatic token refresh when the access token expires
- Custom search API that returns artists, albums, and tracks
- Login screen enforced when no valid token exists
- "No Results" message before searching and when a search returns nothing
- Results link out to the Spotify web player

### Tech Stack

- **Backend:** Node.js, Express, Sequelize, SQLite, dotenv
- **Frontend:** React, Vite
- **API:** Spotify Web API

### Project Structure

```
spotify/
├── client/   # React frontend (port 3000)
└── server/   # Express backend (port 3001)
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher (built with v24)
- npm v10 or higher
- A Spotify **Premium** account (required by Spotify for developer apps as of 2026)
- A Spotify developer app with the redirect URI `http://127.0.0.1:3001/auth/callback`
- A modern browser (latest Chrome, Firefox, Safari, or Edge)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kirenia/spotify.git
cd spotify
```

### 2. Create a Spotify app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and click **Create app**
2. Add the redirect URI `http://127.0.0.1:3001/auth/callback`
3. Select **Web API** and save
4. Copy the **Client ID** and **Client Secret** from the app settings

### 3. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```
PORT=3001
CLIENT_URL=http://127.0.0.1:3000
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/auth/callback
DB_STORAGE=./database.sqlite
```

Start the server:

```bash
npm run dev
```

The SQLite database is created automatically on first run.

### 4. Set up the frontend

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### 5. Open the app

Visit `http://127.0.0.1:3000`. Use `127.0.0.1` instead of `localhost`, since Spotify no longer accepts `localhost` redirect URIs.

## Links

| Name                        | URL                                                 |
| --------------------------- | --------------------------------------------------- |
| Frontend                    | http://127.0.0.1:3000                               |
| Backend                     | http://127.0.0.1:3001                               |
| Health check                | http://127.0.0.1:3001/api/health                    |
| Spotify Developer Dashboard | https://developer.spotify.com/dashboard             |
| Spotify Web API docs        | https://developer.spotify.com/documentation/web-api |
