import { getDistanceBetweenCoordinates } from "@/helpers/get-distance-between-coordinates";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { MaxDistanceError } from "@/use-cases/errors/max-distance-error";
import { MaxNumberOfCheckInsErrors } from "@/use-cases/errors/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { CheckIn } from "@prisma/client";

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

type CheckInUseCaseResponse = {
	checkIn: CheckIn;
};

export class CreateCheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId);
		if (!gym) throw new ResourceNotFoundError();

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError();

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDay) throw new MaxNumberOfCheckInsErrors();

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return { checkIn };
	}
}
