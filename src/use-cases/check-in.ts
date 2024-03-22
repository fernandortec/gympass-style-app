import { compare } from "bcrypt-ts";

import type { UsersRepository } from "@/repositories/users-repository";
import type {} from "@prisma/client";

import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
}

type CheckInUseCaseResponse = {
	checkIn: CheckIn;
};

export class CheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		gymId,
		userId,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.create({})
	}
}
