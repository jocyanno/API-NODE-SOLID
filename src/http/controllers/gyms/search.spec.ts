import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Search Gyms (e2e)", () => {
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
  it("should be able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "A gym for JavaScript enthusiasts",
        phone: "1234567890",
        latitude: -27.2092052,
        longitude: -49.6401091
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gym",
        description: "A gym for Typescript enthusiasts",
        phone: "1234567890",
        latitude: -27.0610928,
        longitude: -49.5229501
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ q: "Javascript" });

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym"
      })
    ]);
  });
});
