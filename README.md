# DevDuel Agent

An AI-powered app that compares two public professional profiles (LinkedIn, GitHub, portfolios, etc.) in an anime-style 1v1 battle. Built for the Track 2 Hackathon, integrating **Bright Data**, **ActionBook**, and **Acontext**.

<img width="1273" height="670" alt="image" src="https://github.com/user-attachments/assets/d45366a5-77cf-4525-b4b1-fc648a50ca89" />

## How It Works

1. **Scrape** -- Collects public profile data from LinkedIn, GitHub, Wikipedia, or portfolio sites using Bright Data and ActionBook.
2. **Score** -- Evaluates profiles across six dimensions: Technical Skill, Strategy, Execution Speed, Leadership, Impact, and Experience.
3. **Transform** -- Maps professional attributes into anime archetypes, techniques, guilds, and mission ranks.
4. **Battle** -- Generates AI roast-style commentary via OpenAI and renders a cinematic split-screen battle with a winner reveal.

## Tech Stack

| Layer | Stack |
|---|---|
| **Backend** | Node.js, Express 5, TypeScript, WebSocket (`ws`) |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts |
| **AI** | OpenAI GPT-4o-mini (battle commentary) |
| **Scraping** | Bright Data (LinkedIn, generic), ActionBook (GitHub, Wikipedia) |
| **State** | Acontext (session & artifact persistence) |

## Project Structure

```
agentforce/
├── backend/
│   └── src/
│       ├── index.ts              # Express + WebSocket server
│       ├── routes/duel.ts        # API endpoints
│       ├── orchestrator/pipeline.ts  # Duel orchestration pipeline
│       └── services/             # scraper, scoring, commentary, etc.
├── frontend/
│   └── src/
│       ├── App.tsx               # Main app
│       ├── components/           # BattleArena, DuelForm, ProfileCard, etc.
│       └── api/duel.ts           # API client
├── .env.example
└── PRD.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- API keys for Bright Data, ActionBook, Acontext, and OpenAI

### Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

```
ACTION_BOOK=your_actionbook_api_key_here
ACONTEXT=your_acontext_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Run the Backend

```bash
cd backend
npm install
npm run dev
```

Starts on `http://localhost:3001`.

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/duel/start` | Start a new duel (returns session ID) |
| `GET` | `/api/duel/:id` | Get completed duel result |
| `GET` | `/api/duel/:id/status` | Get processing status & progress |
| `GET` | `/api/duel/health` | Service health check |

Real-time progress is streamed over WebSocket -- clients subscribe to a session ID and receive stage updates (`scraping`, `normalizing`, `scoring`, `transforming`, `generating_commentary`, `complete`).

## Inspired From

https://devpost.com/software/koyak-kombat
