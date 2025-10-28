import { createServer, Server } from "http";
import { WebSocketServer } from "ws";
import { wsManager } from "./manager";
import { Application } from 'express';

export function configureWebSocketServer(app: Application): Server {
    const httpServer = createServer(app);
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    wsManager.attach(wss);
    return httpServer;
}
