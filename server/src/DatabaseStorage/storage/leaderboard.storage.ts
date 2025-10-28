import { db } from "../../../db";
import { games, type LeaderboardEntry } from "@shared/schema";
import { sql } from "drizzle-orm";

export class LeaderboardStorage {
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
}
