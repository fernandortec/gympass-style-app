import { randomUUID } from "node:crypto";
import type { UsersRepository } from "@/repositories/users-repository";
import type { Prisma, User } from "@prisma/client";
export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = [];

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		};

		this.users.push(user);

		return user;
	}
	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((item) => item.email === email);

		if (!user) return null;

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find((item) => item.id === id);

		if (!user) return null;

		return user;
	}
}
