import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateCheckInUseCase } from "@/use-cases/check-in";
import { MaxDistanceError } from "@/use-cases/errors/max-distance-error";
import { MaxNumberOfCheckInsErrors } from "@/use-cases/errors/max-number-of-check-ins-error";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkInsRepository: CheckInsRepository;
let gymsRepository: GymsRepository;
let sut: CreateCheckInUseCase;

describe("Create check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateCheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "Typescript gym",
			description: "",
			latitude: new Decimal(0),
			longitude: new Decimal(0),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsErrors);
	});

	it("should  able to check in twice in different days", async () => {
		vi.setSystemTime(new Date(2024, 0, 10, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 11, 0, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		const gym = await gymsRepository.create({
			id: "gym-02",
			title: "Typescript gym",
			description: "",
			latitude: new Decimal(-19.7973334),
			longitude: new Decimal(-43.9699836),
		});

		await expect(() =>
			sut.execute({
				gymId: gym.id,
				userId: "user-01",
				userLatitude: -19.6407159,
				userLongitude: -45.167319,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
