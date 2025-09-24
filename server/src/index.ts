import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

async function start() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  const PORT = Number(process.env.PORT || 4000);
  await app.listen({ port: PORT, host: "0.0.0.0" });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
