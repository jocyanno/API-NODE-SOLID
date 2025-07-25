import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password
  }: RegisterUserCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await bcrypt.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash
    });

    return {
      user
    };
  }
}
