import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { hash } from "bcrypt-ts";
import { beforeEach, describe, expect, it } from "vitest";

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it("should be able to authenticate", async () => {
		await usersRepository.create({
			name: "John doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should not be able to authenticate with wrong email", async () => {
		expect(() =>
			sut.execute({
				email: "johndoe@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong pasword", async () => {
		await usersRepository.create({
			name: "John doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
		});

		expect(() =>
			sut.execute({
				email: "johndoe@example.com",
				password: "123123",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
