import { app } from "@/app";
import { createAndAuthenticateUser } from "@/helpers/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Validate check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to validate a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: "JavaScript Gym",
				latitude: -19.7973334,
				longitude: -43.9699836,
			},
		});

		const user = await prisma.user.findFirstOrThrow();

		let checkIn = await prisma.checkIn.create({
			data: { gym_id: gym.id, user_id: user.id },
		});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(204);

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: { id: checkIn.id },
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});
});
