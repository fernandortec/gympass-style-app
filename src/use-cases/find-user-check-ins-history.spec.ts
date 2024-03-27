import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FindUserCheckInsHistoryUseCase } from "@/use-cases/find-user-check-ins-history";
import { beforeEach, describe, expect, it } from "vitest";

let checkInsRepository: CheckInsRepository;
let sut: FindUserCheckInsHistoryUseCase;

describe("Find User Check-ins History Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FindUserCheckInsHistoryUseCase(checkInsRepository);
	});

	it("should be able to find check-in history", async () => {
		await checkInsRepository.create({ gym_id: "gym-01", user_id: "user-01" });
		await checkInsRepository.create({ gym_id: "gym-02", user_id: "user-01" });

		const { checkIns } = await sut.execute({
			userId: "user-01",
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: "gym-01" }),
			expect.objectContaining({ gym_id: "gym-02" }),
		]);
	});

	it("should be able to find paginated check-in history", async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i}`,
				user_id: "user-01",
			});
		}

		const { checkIns } = await sut.execute({
			userId: "user-01",
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: "gym-21" }),
			expect.objectContaining({ gym_id: "gym-22" }),
		]);
	});
});
