import { db } from "../../../db";
import { games, type GameStats } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

export class StatsStorage {
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
}
