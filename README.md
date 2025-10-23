# Multiplayer Tic-Tac-Toe — Project Documentation

## Overview

A real-time multiplayer Tic-Tac-Toe game built with React, Express, and WebSockets. Players can create rooms, join by Game ID, and compete head-to-head with live game-state synchronization. The app includes game history (past 5 games), a real-time leaderboard, and a room system with expiry for waiting rooms.

Quick access:

- Dev server: http://localhost:3000
- DB: PostgreSQL (local)
- UI: Material UI (MUI) with light gaming theme
- Routes: `/` (home/history) and `/game/:gameId` (play)

---

## Quick Start

From project root:

1. Install

```bash
npm install
```

2. Create `.env` with:

```env
DATABASE_URL=postgresql://tictactoe_user:your_secure_password@localhost:5432/tictactoe_db
```

3. Push DB schema

```bash
npm run db:push
```

4. Run dev server

```bash
npm run dev
```

---

## Project Structure (high level)

```
multiplayer-tictactoe/
├── client/                 # Frontend React application
├── server/                 # Backend Express server
├── shared/                 # Shared types and schema
├── SETUP.md                # Setup guide
├── README.md               # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```

---

## Technology Stack

- Frontend: React 18 + TypeScript, Vite, React Router Dom v7, TanStack Query, Material UI (MUI v6)
- Backend: Node.js, Express, ws (WebSocket), Drizzle ORM, PostgreSQL
- Utilities: Zod, esbuild, tsx

---

## Frontend Stack Decisions

### Vite

#### Why Used:

- Blazing-fast HMR (Hot Module Reloading) and build performance.
- Native TypeScript and ES module support.
- Minimal configuration required.

#### Alternatives:

- Create React App (CRA): Outdated, slow builds, and unnecessary dependencies.
- Webpack: Highly customizable but too complex for this scale.

#### Why Not Used:

- Vite offers faster iteration and smaller configs—perfect for modern React apps.

### React Router Dom v7

#### Why Used:

- Industry-standard router for React applications.
- Supports nested routes, loaders, and transitions.
- Excellent TypeScript support and long-term maintenance.

##### Alternatives:

- Wouter: Lightweight router with simpler syntax.

##### Why Not Used:

- Wouter lacks advanced features like loaders and nested routing.
- React Router offers stronger ecosystem and built-in features.

### TanStack Query (React Query)

#### Why Used:

- Simplifies server-state management, caching, and refetching.
- Reduces boilerplate for async data fetching.
- Integrates cleanly with WebSockets for real-time updates.

#### Alternatives:

- SWR (Vercel): Simpler, but less control over cache and mutation logic.
- Redux Toolkit Query: Good but adds unnecessary boilerplate for a small app.

#### Why Not Used:

- TanStack Query offered the best balance between simplicity and power.

### Material UI (MUI v6)

#### Why Used:

- Production-ready component library with modern theming and responsive design.
- Built-in accessibility, consistent styling, and tight React integration.
- Speeds up UI prototyping with pre-built, customizable components.

#### Alternatives:

Radix UI: Lower-level primitives but requires manual styling.
Chakra UI: Good option but MUI v6 has better design flexibility and maturity.
Tailwind CSS: Excellent for custom UIs but slower for pre-styled layouts.

#### Why Not Used:

- MUI provided a polished UI faster without compromising customization.
- Radix/Tailwind combo would require more setup time.

## Backend Stack Decisions

### ws (WebSocket)

#### Why Used:

- Enables real-time bi-directional communication between players.
- Lightweight and low-level, giving full control over the communication layer.

#### Alternatives:

- Socket.IO: Adds layers (fallbacks, rooms, etc.) but more overhead.
- WebRTC: Overkill for a simple turn-based game.

#### Why Not Used:

- ws is closer to the native protocol and fits the minimalistic backend design.

### Drizzle ORM + PostgreSQL

#### Why Used:

- Drizzle ORM is modern, type-safe, and integrates seamlessly with TypeScript.
- Schema inference removes manual typing and reduces DB query bugs.
- PostgreSQL is robust, ACID-compliant, and well-suited for relational data (users, games, moves).

#### Alternatives:

- Prisma: Strong features but slower cold starts and heavier runtime.
- TypeORM / Sequelize: Verbose and less type-safe.
- SQLite: Lightweight but not ideal for concurrent multi-user environments.

#### Why Not Used:

- Drizzle + Postgres offered the best performance, safety, and scalability balance.

## Utilities

### Zod

- Used for input validation and schema definition.
- Syncs perfectly with TypeScript types.
- Alternatives: Yup, Joi — heavier and less integrated with TS.

### esbuild + tsx

- Used for lightning-fast backend bundling and TypeScript runtime execution.
- Alternative: ts-node (slower startup, higher memory usage).

## System & Platform

- Developed on Windows, my current working environment.
- Fully cross-platform — compatible with macOS and Linux.
- Build and dev scripts can be easily adapted for Unix shells.

---

## High-Level Architecture

- Server hosts REST API and WebSocket server on same port (3000).
- REST endpoints provide initial data and management (games, stats, leaderboard).
- WebSocket handles real-time events: join, move, forfeit, gameUpdate, gameStarted, playerDisconnected, error.
- Shared types and schema live in `shared/` so client and server stay type-safe and consistent.

---

## Detailed File Documentation

### Root files

- `package.json`

  - Defines dependencies and scripts (`dev`, `db:push`, `db:studio`, `start`, `build`).

- `tsconfig.json`

  - TypeScript configuration (ES2020 target, strict mode, path aliases).

- `vite.config.ts`

  - Vite configuration (React plugin, aliases, HMR).

- `drizzle.config.ts`
  - Drizzle ORM config (DATABASE_URL env, schema location, migrations).

---

### shared/

- `shared/schema.ts`
  - Database schema (Drizzle) and shared TypeScript types.
  - Tables: `games` (id, player1Nickname, player2Nickname, boardState jsonb, currentTurn, winner, status, createdAt, completedAt).
  - Zod runtime validators for messages/entities.
  - Types exported: `Game`, `InsertGame`, `UpdateGame`, `WSMessage`, `GameStats`, `LeaderboardEntry`.

Why: Single source of truth; safe sharing between frontend and backend.

---

### server/

- `server/index.ts`

  - Express app bootstrap: middleware (JSON, sessions), mounts routes and optional Vite middleware in dev, starts HTTP server, graceful shutdown.

- `server/routes.ts`

  - HTTP API endpoints and WebSocket request routing.
  - Endpoints:
    - GET /api/games — recent 50 games
    - GET /api/games/:id — specific game
    - POST /api/games/start — create or join game
    - DELETE /api/games/:id — delete game (used for expiry/manual cancel)
    - GET /api/stats — aggregated stats
    - GET /api/leaderboard — aggregated top players
    - GET /api/online-count — active WebSocket count
  - WebSocket server at `/ws` with room management (gameId → Set<WebSocket>).

- `server/storage.ts`

  - IStorage interface and DatabaseStorage implementation using Drizzle.
  - Methods: `getGame`, `createGame`, `updateGame`, `getAllGames`, `getGameStats`, `getWaitingGame`, `getLeaderboard`, `deleteGame`.
  - Leaderboard uses UNION ALL pattern to aggregate wins from both player1 and player2.

- `server/db.ts`

  - Database connection initialization; reads `DATABASE_URL`, instantiates Drizzle DB client.

- `server/vite.ts`

  - Dev integration: mounts Vite middleware to Express during development.

- `server/gameLogic.ts`
  - Pure, testable functions: `isValidMove`, `checkWinner`, `makeMove`.
  - Immutable board transformations and win patterns.

---

### client/

- `client/src/main.tsx`

  - React entry: imports CSS, creates root, renders `<App />`.

- `client/src/App.tsx`

  - Root component with providers:
    - ThemeProvider (MUI light gaming theme)
    - QueryClientProvider (TanStack Query)
    - BrowserRouter (React Router)
    - Routes: `/`, `/game/:gameId`, `*`.

- `client/src/lib/queryClient.ts`

  - TanStack Query client and `apiRequest` wrapper (typed fetch wrapper with centralized error handling).

- Pages:

  - `client/src/pages/GameLandingPage.tsx`
    - Landing page: nickname management (localStorage), Create/Join flows, statistics, recent 5 games, leaderboard.
    - Uses TanStack Query, MUI components, dialogs for nickname/ID input.
  - `client/src/pages/GamePlay.tsx`
    - Active gameplay with WebSocket connection and reconnection logic.
    - Establishes WebSocket on mount, sends `join`, listens to `gameUpdate` and other messages.
    - Assigns player symbol based on nickname.
    - Handles move clicks, forfeit button, win/draw detection, result modal.
    - Connection status indicator and cleanup on unmount.
  - `client/src/pages/not-found.tsx`
    - 404 page with link back to home.

- Components (MUI):

  - `GameBoard.tsx` — 3x3 grid using MUI Buttons/Cards.
  - `WaitingRoom.tsx` — waiting screen with Game ID, copy-to-clipboard, countdown timer (10-minute expiry).
  - `GameResultModal.tsx` — modal showing winner/draw.
  - `StatsCards.tsx`, `Leaderboard.tsx`, `GameCard.tsx` — UI for history and stats.
  - `PlayerPanel.tsx` — This is player Pannel for running game.
  - `PlayHeader.tsx` — Header for running game
  - `StatusPanel.tsx` — Contains details for runnig game turn.
  - `ActionButtos.tsx` — Contains create or join room actions.
  - `Header.tsx` — Application header to show title.
  - `JoinDialog.tsx` — Join the game dialog with ID input.
  - `StatsCards.tsx`, `Leaderboard.tsx`, `GameCard.tsx` — UI for history and stats.

- Styles:
  - `client/src/pages/GameLanding.styles.ts` - Ts styles file for game Landing page module.
  - `client/src/pages/GamePlay.styles.ts` - Ts styles file for game Landing page module.

---

## Data Flow Summaries

- Creating a new game:

  - Client POST /api/games/start → server creates `waiting` game → client navigates to `/game/:id` → WebSocket `join` → waiting room UI.

- Joining a game by ID:

  - Client POST /api/games/start with gameId → server updates player2, status → broadcasts `gameStarted`.

- Making a move:

  - Client sends WebSocket `move` with cellIndex and playerSymbol → server validates (turn, cell empty, game active) → server applies `makeMove`, checks `checkWinner`, updates DB, broadcasts `gameUpdate`.

- Forfeit:
  - Client sends WebSocket `forfeit` → server marks opponent as winner, updates DB, broadcasts update.

---

## Database Schema (summary)

Table: `games`

- id: UUID (PK)
- player1Nickname: text
- player2Nickname: text (nullable)
- boardState: jsonb (array of 9: "X" | "O" | null)
- currentTurn: text ("X" | "O")
- winner: text (nullable: "Player 1" | "Player 2" | "Draw")
- status: text ("waiting" | "playing" | "completed")
- createdAt: timestamp
- completedAt: timestamp (nullable)

---

## WebSocket Message Types

- join (client → server): { type: "join", gameId, playerNickname }
- move (client → server): { type: "move", gameId, cellIndex, playerSymbol }
- forfeit (client → server): { type: "forfeit", gameId, playerNickname }
- gameUpdate (server → clients): full game object
- gameStarted (server → clients): game started notification
- playerDisconnected (server → clients): informs other player
- error (server → clients): validation or system errors

All messages validated with Zod schemas from `shared/schema.ts`.

---

## Features & UX Notes

- Light gaming MUI theme (fonts: Rajdhani, Exo 2, Inter).
- 10-minute waiting-room expiry with server-side auto-delete and manual cancel.
- Copy Game ID to clipboard.
- Past 5 games shown on homepage; leaderboard top 10 by wins.
- Forfeit button available in active games — opponent auto-wins.
- Real-time online count supported via polling `/api/online-count`.

## Development Workflow

1. Edit `shared/schema.ts` for DB schema changes.
2. Run `npm run db:push` to apply schema.
3. Edit server endpoints in `server/routes.ts`; use `server/storage.ts` for DB access.
4. Edit frontend in `client/src/` and rely on HMR via `npm run dev`.
5. Use TanStack Query for server state and query invalidation patterns.

---

## Useful Commands

- Install: `npm install`
- Run dev: `npm run dev`
- Push DB schema: `npm run db:push`
- DB GUI: `npm run db:studio`
- Build: `npm run build`
- Start production: `npm start`

DB CLI (example):

- List tables: `psql -U tictactoe_user -d tictactoe_db -c "\dt"`
- Last 10 games:
  `psql -U tictactoe_user -d tictactoe_db -c "SELECT id, player1_nickname, player2_nickname, winner, status, created_at FROM games ORDER BY created_at DESC LIMIT 10;"`

Backup/restore:

- Backup: `pg_dump -U tictactoe_user -d tictactoe_db > tictactoe_backup.sql`
- Restore: `psql -U tictactoe_user -d tictactoe_db < tictactoe_backup.sql`

---

## Testing & QA

- Manual E2E:
  - Create room → copy ID → join in incognito → play until win/draw → verify DB updated.
  - Test forfeit flow: forfeit from one client, verify opponent wins.
  - Test waiting room expiry and manual cancel.
- Verify WebSocket reconnection/backoff (client up to 5 attempts).
- Verify leaderboard aggregation (wins from both player positions).

---

## Notes & Next Steps

- Remaining TODOs:
  - Add unit tests cases for application.
  - Add integration tests for WebSocket flows.
  - Add user accounts and persistent profiles.
  - Multilingual Feature
  - Token based Authentication

## AI Assistance

This project used AI assistance for productivity and drafting. Copilot was used to suggest code snippets and help draft documentation. All generated suggestions were reviewed and edited by the me.
