import request from "supertest";
import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.checkIn.deleteMany();
    await prisma.user.deleteMany();
    await prisma.gym.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "A gym for JavaScript enthusiasts",
        phone: "1234567890",
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    expect(response.statusCode).toEqual(201);
  });
});
