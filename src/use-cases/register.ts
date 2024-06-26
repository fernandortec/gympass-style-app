import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists-error";

import type { User } from "@prisma/client";
import { hash } from "bcrypt-ts";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		name,
		password,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const password_hash = await hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) throw new ResourceAlreadyExistsError();

		const user = await this.usersRepository.create({
			email,
			name,
			password_hash,
		});
		return { user };
	}
}
