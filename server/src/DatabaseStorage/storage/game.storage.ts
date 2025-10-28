import { db } from "../../../db";
import {
  games,
  type Game,
  type InsertGame,
  type UpdateGame,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class GameStorage {
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
    return db.select().from(games).orderBy(desc(games.createdAt)).limit(50);
  }

  async getWaitingGame(): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.status, "waiting"))
      .limit(1);
    return game || undefined;
  }

  async deleteGame(id: string): Promise<void> {
    await db.delete(games).where(eq(games.id, id));
  }
}
