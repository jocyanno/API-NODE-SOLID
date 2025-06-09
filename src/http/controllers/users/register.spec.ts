import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.checkIn.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    expect(response.statusCode).toEqual(201);
  });
});
