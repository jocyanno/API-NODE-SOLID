import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
}