import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt-ts";
import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false,
): Promise<{ token: string }> {
	await prisma.user.create({
		data: {
			name: "John doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
			role: isAdmin ? "ADMIN" : "MEMBER",
		},
	});

	await request(app.server).post("/users").send({
		name: "John doe",
		email: "johndoe@example.com",
		password: "123456",
	});

	const authResponse = await request(app.server).post("/sessions").send({
		email: "johndoe@example.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return { token };
}
