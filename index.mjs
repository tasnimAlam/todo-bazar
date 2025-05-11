import Fastify from "fastify";
import mysql from "@fastify/mysql";
import "dotenv/config";

const fastify = Fastify({
  logger: true,
});

fastify.register(mysql, {
  promise: true,
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

fastify.get("/tasks", async (request, reply) => {
  const [rows] = await fastify.mysql.query("SELECT * FROM tasks");
  return rows;
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
