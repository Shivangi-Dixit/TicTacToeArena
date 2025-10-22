import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  player1Nickname: text("player1_nickname").notNull(),
  player2Nickname: text("player2_nickname"),

  boardState: json("board_state")
    .$type<(string | null)[]>()
    .notNull()
    .default(sql`'[null,null,null,null,null,null,null,null,null]'::json`),
  currentTurn: text("current_turn").notNull().default("X"),
  winner: text("winner"),
  status: text("status").notNull().default("waiting"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const updateGameSchema = z.object({
  boardState: z.array(z.string().nullable()).length(9).optional(),
  currentTurn: z.enum(["X", "O"]).optional(),
  winner: z.string().nullable().optional(),
  status: z.enum(["waiting", "playing", "completed"]).optional(),
  player2Nickname: z.string().optional(),
  completedAt: z.date().optional(),
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type UpdateGame = z.infer<typeof updateGameSchema>;

export const wsMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    gameId: z.string(),
    playerNickname: z.string(),
  }),

  z.object({
    type: z.literal("move"),
    gameId: z.string(),
    cellIndex: z.number().min(0).max(8),
    playerSymbol: z.enum(["X", "O"]),
  }),

  z.object({
    type: z.literal("gameUpdate"),
    game: z.custom<Game>(),
  }),

  z.object({
    type: z.literal("gameStarted"),
    game: z.custom<Game>(),
  }),

  z.object({
    type: z.literal("playerDisconnected"),
    gameId: z.string(),
  }),

  z.object({
    type: z.literal("forfeit"),
    gameId: z.string(),
    playerNickname: z.string(),
  }),

  z.object({
    type: z.literal("error"),
    message: z.string(),
  }),
]);

export type WSMessage = z.infer<typeof wsMessageSchema>;

export type GameStats = {
  totalGames: number;
  player1Wins: number;
  player2Wins: number;
  draws: number;
};

export type LeaderboardEntry = {
  playerNickname: string;
  wins: number;
  games: number;
};
