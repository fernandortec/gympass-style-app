import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists-error";
import { RegisterUseCase } from "@/use-cases/register";
import { compare } from "bcrypt-ts";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it("should hash user password upon registration", async () => {
		const { user } = await sut.execute({
			name: "John doe",
			email: "johndoe@example.com",
			password: "@123456",
		});

		const isPasswordCorrectlyHashed = await compare(
			"@123456",
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should not be able to register with same email twice", async () => {
		const email = "johndoe@example.com";

		await sut.execute({
			name: "John doe",
			email: email,
			password: "@123456",
		});

		await expect(
			sut.execute({
				name: "John doe",
				email: email,
				password: "@123456",
			}),
		).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
	});

	it("should be able to register", async () => {
		const { user } = await sut.execute({
			name: "John doe",
			email: "johndoe@example.com",
			password: "@123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
