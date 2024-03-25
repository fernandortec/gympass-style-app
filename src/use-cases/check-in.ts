import type { CheckIn } from "@prisma/client";

import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

type CheckInUseCaseResponse = {
	checkIn: CheckIn;
};

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		gymId,
		userId,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId)
		if(!gym) throw new ResourceNotFoundError()

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDay) throw new Error();

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return { checkIn };
	}
}
