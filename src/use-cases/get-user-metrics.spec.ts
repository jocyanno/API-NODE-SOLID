import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

// Unit Test

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Fetch User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-01"
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01"
    });

    expect(checkInsCount).toBe(2);
  });
});
