import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { ValidateCheckInUseCase } from "@/use-cases/validate-check-in";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let checkInsRepository: CheckInsRepository;

let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		// vi.useFakeTimers();
	});

	afterEach(() => {
		// vi.useRealTimers();
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
});
