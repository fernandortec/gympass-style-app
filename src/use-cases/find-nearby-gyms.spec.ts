import type { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FindNearbyGymsUseCase } from "@/use-cases/find-nearby-gyms";

import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: GymsRepository;
let sut: FindNearbyGymsUseCase;

describe("Find nearby gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FindNearbyGymsUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "Near Gym",
			phone: null,
			description: null,
			latitude: -19.7973334,
			longitude: -43.9699836,
		});

		await gymsRepository.create({
			title: "Far Gym",
			phone: null,
			description: null,
			latitude: -19.6407159,
			longitude: -45.167319,
		});

		const { gyms } = await sut.execute({
			userLatitude: -19.7973334,
			userLongitude: -43.9699836,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
	});
});
