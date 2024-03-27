import type { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "@/use-cases/create-gym";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: GymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it("should be able to create a gym", async () => {
		const { gym } = await sut.execute({
			title: "JavaScript Gym",
			phone: null,
			description: null,
			latitude: -19.7973334,
			longitude: -43.9699836,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
