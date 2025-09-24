import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { createRoom, getRoom } from "./store";
import { z } from "zod";

async function start() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  // create a new room
  app.post("/rooms", async (_req, reply) => {
    const room = createRoom();
    reply.send({ id: room.id });
  });

  // get room state
  app.get("/rooms/:id", async (req, reply) => {
    const { id } = z
      .object({ id: z.string().min(3).max(12) })
      .parse(req.params);
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
