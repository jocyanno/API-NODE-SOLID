import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";


export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  });

  const { name, email, password } = bodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUserCase = new RegisterUserCase(usersRepository);

    await registerUserCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send();
    }
  }

  return reply.status(201).send();
}
