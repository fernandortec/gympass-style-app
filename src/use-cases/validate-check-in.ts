import { getDistanceBetweenCoordinates } from "@/helpers/get-distance-between-coordinates";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { MaxDistanceError } from "@/use-cases/errors/max-distance-error";
import { MaxNumberOfCheckInsErrors } from "@/use-cases/errors/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { CheckIn } from "@prisma/client";

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

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return { checkIn };
	}
}
