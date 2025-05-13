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

// Create a new task
fastify.post("/tasks", async (request, reply) => {
  const { title } = request.body;
  if (!title) return reply.code(400).send({ error: "Title is required" });

  const [result] = await fastify.mysql.query(
    "INSERT INTO tasks (title) VALUES (?)",
    [title]
  );

  return { id: result.insertId, title };
});

// Update a task
fastify.put("/tasks/:id", async (request, reply) => {
  const { id } = request.params;
  const { title } = request.body;
  if (!title) return reply.code(400).send({ error: "Title is required" });

  const [result] = await fastify.mysql.query(
    "UPDATE tasks SET title = ? WHERE id = ?",
    [title, id]
  );

  if (result.affectedRows === 0) {
    return reply.code(404).send({ error: "Task not found" });
  }

  return { id, title };
});

// Delete a task
fastify.delete("/tasks/:id", async (request, reply) => {
  const { id } = request.params;

  const [result] = await fastify.mysql.query("DELETE FROM tasks WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return reply.code(404).send({ error: "Task not found" });
  }

  return { message: "Task deleted" };
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
