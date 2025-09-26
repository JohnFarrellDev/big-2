import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createLobby, getLobby, joinLobby } from "../../store";

export async function registerLobbyRoutes(app: FastifyInstance) {
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
}
