import { app } from "@/app";
import { createAndAuthenticateUser } from "@/helpers/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("History check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list the history of check-ins", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: "JavaScript Gym",
				phone: null,
				description: null,
				latitude: -19.7973334,
				longitude: -43.9699836,
			},
		});

		const checkIns = await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id,
				},
				{
					gym_id: gym.id,
					user_id: user.id,
				},
			],
		});

		const response = await request(app.server)
			.get("/check-ins/history")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({ gym_id: gym.id, user_id: user.id }),
			expect.objectContaining({ gym_id: gym.id, user_id: user.id }),
		]);
	});
});
