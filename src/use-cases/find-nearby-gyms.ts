import type { GymsRepository } from "@/repositories/gyms-repository";

import type { Gym } from "@prisma/client";

interface FindNearbyGymsUseCaseRequest {
	userLatitude: number;
	userLongitude: number;
}

interface FindNearbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FindNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FindNearbyGymsUseCaseRequest): Promise<FindNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		return { gyms };
	}
}
