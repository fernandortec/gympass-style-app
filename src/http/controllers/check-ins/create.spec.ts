import { app } from "@/app";
import { createAndAuthenticateUser } from "@/helpers/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const gym = await prisma.gym.create({
			data: {
				title: "JavaScript Gym",
				phone: null,
				description: null,
				latitude: -19.7973334,
				longitude: -43.9699836,
			},
		});

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -19.7973334,
				longitude: -43.9699836,
			});

		expect(response.statusCode).toBe(201);
	});
});
