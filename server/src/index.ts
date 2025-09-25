import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { createRoom, getRoom, joinRoom } from "./store";
import { z } from "zod";

async function start() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  // create a new room
  app.post("/rooms", async (req, reply) => {
    console.log("🚀 ~ start ~ req:", req.body);
    const { playerId, name } = z
      .object({ playerId: z.uuid(), name: z.string().min(1).max(20) })
      .parse(req.body);

    const room = createRoom();

    joinRoom(room.id, playerId, name);

    reply.send({ id: room.id, playerId, name });
  });

  // get room state
  app.get("/rooms/:id", async (req, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const room = getRoom(id);
    if (!room) return reply.code(404).send({ error: "not_found" });
    reply.send(room);
  });

  const PORT = Number(process.env.PORT || 4000);
  await app.listen({ port: PORT, host: "0.0.0.0" });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
