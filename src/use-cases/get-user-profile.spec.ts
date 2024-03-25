import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { GetUserProfileUseCase } from "@/use-cases/get-user-profile";
import { compare, hash } from "bcrypt-ts";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: UsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it("should be able to find a user profile", async () => {
		const createdUser = await usersRepository.create({
			name: "John doe",
			email: "johndoe@example.com",
			password_hash: await hash("@123456", 6),
		});

		const { user } = await sut.execute({ userId: createdUser.id });

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual("John doe");
	});

	it("should throw if user does not exists", async () => {
		await expect(
			sut.execute({
				userId: "non-existing-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
