import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "@/use-cases/get-user-metrics";
import { hash } from "bcrypt-ts";
import { beforeEach, describe, expect, it } from "vitest";

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new GetUserMetricsUseCase(checkInsRepository);
	});

	it("should be able to get a user's metrics", async () => {
		await checkInsRepository.create({ gym_id: "gym-01", user_id: "user-01" });
		await checkInsRepository.create({ gym_id: "gym-02", user_id: "user-01" });

		const { checkInsCount } = await sut.execute({ userId: "user-01" });

		expect(checkInsCount).toEqual(2);
	});
});
