import type { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "@/use-cases/search-gyms";

import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "JavaScript Gym",
			phone: null,
			description: null,
			latitude: -19.7973334,
			longitude: -43.9699836,
		});

		await gymsRepository.create({
			title: "TypeScript Gym",
			phone: null,
			description: null,
			latitude: -19.7973334,
			longitude: -43.9699836,
		});

		const { gyms } = await sut.execute({
			query: "JavaScript",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "JavaScript Gym" }),
		]);
	});

	it("should be able to find paginated gym search", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript Gym - ${i}`,
				phone: null,
				description: null,
				latitude: -19.7973334,
				longitude: -43.9699836,
			});
		}

		const { gyms } = await sut.execute({
			query: "JavaScript",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "JavaScript Gym - 21" }),
			expect.objectContaining({ title: "JavaScript Gym - 22" }),
		]);
	});
});
