import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserCase { 

  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUserCaseRequest) {
  const passwordHash = await hash(password, 6);

  const userWithSameEmail = await this.usersRepository.findByEmail(email);

  if (userWithSameEmail) {
    throw new Error("User with same e-mail already exists.");
  }

  this.usersRepository.create({
    name,
    email,
    password_hash: passwordHash
  })
}
}

