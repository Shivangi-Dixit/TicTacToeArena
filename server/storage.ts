import {
  games,
  type Game,
  type InsertGame,
  type UpdateGame,
  type GameStats,
  type LeaderboardEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: UpdateGame): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
  getGameStats(): Promise<GameStats>;
  getWaitingGame(): Promise<Game | undefined>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;

  deleteGame(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame as any)
      .returning();
    return game;
  }

  async updateGame(id: string, updates: UpdateGame): Promise<Game | undefined> {
    const [game] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();
    return game || undefined;
  }

  async getAllGames(): Promise<Game[]> {
    return await db
      .select()
      .from(games)
      .orderBy(desc(games.createdAt))
      .limit(50);
  }

  async getGameStats(): Promise<GameStats> {
    const result = await db
      .select({
        totalGames: sql<number>`count(*)::int`,
        player1Wins: sql<number>`count(*) filter (where ${games.winner} = 'Player 1')::int`,
        player2Wins: sql<number>`count(*) filter (where ${games.winner} = 'Player 2')::int`,
        draws: sql<number>`count(*) filter (where ${games.winner} = 'Draw')::int`,
      })
      .from(games)
      .where(eq(games.status, "completed"));

    return (
      result[0] || {
        totalGames: 0,
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
      }
    );
  }

  async getWaitingGame(): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.status, "waiting"))
      .limit(1);
    return game || undefined;
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const result = await db.execute<{
      player_nickname: string;
      wins: string;
      games: string;
    }>(sql`
      WITH player_stats AS (
        SELECT 
          player1_nickname as player_nickname,
          COUNT(*) FILTER (WHERE winner = 'Player 1') as wins,
          COUNT(*) as games
        FROM ${games}
        WHERE status = 'completed' AND player1_nickname IS NOT NULL
        GROUP BY player1_nickname
        
        UNION ALL
        
        SELECT 
          player2_nickname as player_nickname,
          COUNT(*) FILTER (WHERE winner = 'Player 2') as wins,
          COUNT(*) as games
        FROM ${games}
        WHERE status = 'completed' AND player2_nickname IS NOT NULL
        GROUP BY player2_nickname
      )
      SELECT 
        player_nickname,
        SUM(wins)::text as wins,
        SUM(games)::text as games
      FROM player_stats
      GROUP BY player_nickname
      HAVING SUM(wins) > 0
      ORDER BY SUM(wins) DESC, SUM(games) ASC
      LIMIT 50
    `);

    return result.rows.map((row) => ({
      playerNickname: row.player_nickname,
      wins: parseInt(row.wins),
      games: parseInt(row.games),
    }));
  }

  async deleteGame(id: string): Promise<void> {
    await db.delete(games).where(eq(games.id, id));
  }
}

export const storage = new DatabaseStorage();
