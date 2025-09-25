import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { createLobby, getLobby, joinLobby, leaveLobby } from "./store";
import { z } from "zod";

import { Server as IOServer } from "socket.io";

async function start() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  // create a new lobby
  app.post("/lobby", async (req, reply) => {
    const { playerId, name } = z
      .object({ playerId: z.uuid(), name: z.string().min(1).max(20) })
      .parse(req.body);

    const lobby = createLobby();

    joinLobby(lobby.id, playerId, name);

    reply.send({ lobbyId: lobby.id, playerId, name });
  });

  // get lobby state
  app.get("/lobby/:id", async (req, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const lobby = getLobby(id);
    if (!lobby) return reply.code(404).send({ error: "not_found" });
    reply.send(lobby);
  });

  const PORT = Number(process.env.PORT || 4000);
  await app.listen({ port: PORT, host: "0.0.0.0" });

  const io = new IOServer(app.server, {
    cors: { origin: true, credentials: true },
  });

  io.on("connection", (socket) => {
    // Use client-provided stable id (localStorage) or fallback to socket.id
    const uid = (socket.handshake.auth?.uid as string) || socket.id;

    socket.on("lobby:join", (payload: { lobbyId: string; name: string }) => {
      const { lobbyId, name } = z
        .object({
          lobbyId: z.uuid(),
          name: z.string().min(1).max(20),
        })
        .parse(payload);

      const lobby = joinLobby(lobbyId, uid, name);
      socket.join(lobbyId);
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
