import type { User } from "@prisma/client";

import { getDistanceBetweenCoordinates } from "@/helpers/get-distance-between-coordinates";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
	userId: string;
}

type GetUserProfileUseCaseResponse = {
	user: User;
};

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) throw new ResourceNotFoundError();

		return { user };
	}
}
