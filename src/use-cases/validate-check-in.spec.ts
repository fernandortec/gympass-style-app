import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { LateCheckInValidationError } from "@/use-cases/errors/late-check-in-validation-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { ValidateCheckInUseCase } from "@/use-cases/validate-check-in";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkInsRepository: CheckInsRepository;

let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to validate the check-in", async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		});

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id,
		});

		const checkInInsideRepository = await checkInsRepository.findById(
			checkIn.id,
		);

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInInsideRepository?.validated_at).toEqual(expect.any(Date));
	});

	it("should not be able to validate an inexistent check-in", async () => {
		await expect(() =>
			sut.execute({
				checkInId: "inexistent-check-in-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2024, 0, 1, 12, 0));

		const createdCheckIn = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		});

		const twentyOneMinutesInMS = 1000 * 60 * 21;

		vi.advanceTimersByTime(twentyOneMinutesInMS);

		await expect(() =>
			sut.execute({
				checkInId: createdCheckIn.id,
			}),
		).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
