import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-repository";
import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history";

// Unit Test

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistory;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistory(checkInsRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
        created_at: new Date(),
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-21",
      }),
      expect.objectContaining({
        gym_id: "gym-22",
      }),
    ])
  });
});
