import { getDistanceBetweenCoordinates } from "@/helpers/get-distance-between-coordinates";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { LateCheckInValidationError } from "@/use-cases/errors/late-check-in-validation-error";
import { MaxDistanceError } from "@/use-cases/errors/max-distance-error";
import { MaxNumberOfCheckInsErrors } from "@/use-cases/errors/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { CheckIn } from "@prisma/client";
import dayjs from "dayjs";

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}

type ValidateCheckInUseCaseResponse = {
	checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			"minutes",
		);

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return { checkIn };
	}
}
