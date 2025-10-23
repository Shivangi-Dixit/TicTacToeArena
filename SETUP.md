# Multiplayer Tic-Tac-Toe - Complete Setup Guide

This guide will help you set up and run the application on your local machine with a PostgreSQL database.

## Prerequisites

Before you begin, ensure you have the following installed on your laptop:

1. **Node.js** (v18 or higher)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)

   - Verify installation: `npm --version`

3. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Choose the installer for your operating system

## Part 1: PostgreSQL Installation & Setup

1. **Download PostgreSQL**

   - Go to https://www.postgresql.org/download/windows/
   - Download the installer (e.g., postgresql-15.x-windows-x64.exe)

2. **Run the Installer**

   - Double-click the downloaded file.
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\15`)
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set a password for the `postgres` user (remember this!)
   - Default port: 5432
   - Default locale: Use system default

3. **Verify Installation**
   ```cmd
   psql --version
   ```

## Part 2: Database Configuration

### Step 1: Create Database and User

1. **Access PostgreSQL**

   **Windows:**

   ```cmd
   psql -U postgres
   ```

   Enter the password you set during installation.

2. **Create Database and User**

   Run these SQL commands in the PostgreSQL prompt:

   ```sql
   -- Create a database
   CREATE DATABASE tictactoe_db;

   -- Create user
   CREATE USER tictactoe_user WITH PASSWORD 'your_secure_password';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE tictactoe_db TO tictactoe_user;

   -- Exit PostgreSQL
   \q
   ```

### Step 2: Get Database Connection URL

Your database connection URL will be in this format:

```
postgresql://tictactoe_user:your_secure_password@localhost:5432/tictactoe_db
```

Replace `your_secure_password` with the password you set for `tictactoe_user`.

## Part 3: Application Setup

### Step 1: Install Dependencies

```in project root
npm install
```

This will install all required packages from package.json:

### Step 2: Environment Configuration

1. **Add environment variables** to `.env`:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://tictactoe_user:your_secure_password@localhost:5432/tictactoe_db

   **Important:** Replace the DATABASE_URL with your actual credentials!
   ```

### Step 3: Initialize Database Schema

Run the database push command to create all necessary tables:

```in project root
npm run db:push
```

This will create the `games` table with all required columns.

**Expected Output:**

```
✓ Drizzle ORM successfully pushed schema changes
```

### Step 4: Verify Database Setup

1. **Connect to your database:**

   ```cmd
   psql -U tictactoe_user -d tictactoe_db
   ```

2. **Check if table exists:**

   ```sql
   \dt
   ```

   You should see the `games` table listed.

3. **View table structure:**

   ```sql
   \d games
   ```

4. **Exit:**
   ```sql
   \q
   ```

## Part 4: Running the Application

### Development Mode

Start the development server:

```cmd
npm run dev
```

This command will:

1. Start the Express backend server on port 3000
2. Start the Vite development server
3. Set up WebSocket server for real-time gameplay
4. Enable hot module replacement (HMR)

**Expected Output:**

```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

WebSocket server configured on /ws
4:02:13 PM [express] serving on port 3000
```

### Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the Tic-Tac-Toe home screen with:

- "Create New Room" button
- "Join Room by ID" button
- Game statistics
- Recent games list
- Leaderboard

## Part 5: Testing the Application

### Single Player Test

1. Open the application
2. Enter your nickname
3. Click "Create New Room"
4. You'll be taken to a waiting room with a Game ID
5. Share this Game ID to invite another player

### Two Player Test

1. **Player 1:**

   - Open `http://localhost:3000` in one browser
   - Enter nickname "Player1"
   - Click "Create New Room"
   - Copy the Game ID from the URL or waiting screen

2. **Player 2:**

   - Open `http://localhost:3000` in another browser (or incognito window)
   - Enter nickname "Player2"
   - Click "Join Room by ID"
   - Enter the Game ID from Player 1
   - Click "Join"

3. **Play the game:**
   - Both players should now see the game board
   - Player 1 (X) goes first
   - Players alternate turns
   - Game ends when someone wins or it's a draw

## Part 6: Database Management

### View All Games

```cmd
psql -U tictactoe_user -d tictactoe_db

SELECT id, player1_nickname, player2_nickname, winner, status, created_at
FROM games
ORDER BY created_at DESC
LIMIT 10;
```

### View Leaderboard Manually

```sql
SELECT
  player_nickname,
  SUM(wins) as total_wins,
  SUM(games) as total_games
FROM (
  SELECT
    player1_nickname as player_nickname,
    COUNT(*) FILTER (WHERE winner = 'Player 1') as wins,
    COUNT(*) as games
  FROM games
  WHERE status = 'completed' AND player1_nickname IS NOT NULL
  GROUP BY player1_nickname

  UNION ALL

  SELECT
    player2_nickname as player_nickname,
    COUNT(*) FILTER (WHERE winner = 'Player 2') as wins,
    COUNT(*) as games
  FROM games
  WHERE status = 'completed' AND player2_nickname IS NOT NULL
  GROUP BY player2_nickname
) player_stats
GROUP BY player_nickname
HAVING SUM(wins) > 0
ORDER BY SUM(wins) DESC
LIMIT 10;
```

### Clear All Games (Fresh Start)

```cmd
psql -U tictactoe_user -d tictactoe_db -c "DELETE FROM games;"
```

### Backup Database

```cmd
pg_dump -U tictactoe_user -d tictactoe_db > tictactoe_backup.sql
```

### Restore Database

```cmd
psql -U tictactoe_user -d tictactoe_db < tictactoe_backup.sql
```

## Additional Commands

### Development

```projet root
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Getting Help

If you encounter any issues:

1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check the logs in the terminal

## Next Steps

After successfully setting up:

1. Explore the codebase (see FILE_DOCUMENTATION.md)
2. Add new features
3. Deploy to production

Congratulations! Your Multiplayer Tic-Tac-Toe application is now running.
