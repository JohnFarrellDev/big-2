import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import {
  createLobby,
  getLobby,
  joinLobby,
  leaveLobby,
  renamePlayer,
} from "./store";
import { z } from "zod";

import { Server as IOServer } from "socket.io";
import { registerLobbyRoutes } from "./features/lobby/register";

async function start() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  registerLobbyRoutes(app);

  const PORT = Number(process.env.PORT || 4000);
  await app.listen({ port: PORT, host: "0.0.0.0" });

  const io = new IOServer(app.server, {
    cors: { origin: true, credentials: true },
  });

  io.on("connection", (socket) => {
    // Use client-provided stable id (localStorage) or fallback to socket.id
    const uid = (socket.handshake.auth?.uid as string) || socket.id;

    socket.on(
      "lobby:join",
      (payload: { lobbyId: string; playerName: string }) => {
        const { lobbyId, playerName } = z
          .object({
            lobbyId: z.uuid(),
            playerName: z.string().min(1).max(20),
          })
          .parse(payload);

        const lobby = joinLobby(lobbyId, uid, playerName);
        socket.join(lobbyId);
        io.to(lobbyId).emit("lobby:state", lobby);
      }
    );

    socket.on(
      "lobby:set-name",
      (payload: { lobbyId: string; newLobbyName: string }) => {
        const { lobbyId, newLobbyName } = z
          .object({
            lobbyId: z.uuid(),
            newLobbyName: z.string().min(1).max(100),
          })
          .parse(payload);

        const lobby = getLobby(lobbyId);
        if (!lobby) return;

        lobby.name = newLobbyName;

        io.to(lobbyId).emit("lobby:state", lobby);
      }
    );

    socket.on("player:updateName", ({ lobbyId, name }) => {
      renamePlayer(lobbyId, uid, name);
      const lobby = getLobby(lobbyId);

      io.to(lobbyId).emit("lobby:state", lobby);
    });

    socket.on("lobby:leave", (lobbyId: string) => {
      const lobby = leaveLobby(lobbyId, uid);
      socket.leave(lobbyId);
      if (lobby) io.to(lobbyId).emit("lobby:state", lobby);
    });

    // On reconnect, client will re-emit lobby:join (see client)
    socket.on("disconnect", () => {});
  });

  app.log.info(`Socket.IO ready on ws://localhost:${PORT}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
