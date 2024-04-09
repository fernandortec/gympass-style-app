import { app } from "@/app";
import { createAndAuthenticateUser } from "@/helpers/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a gym", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const response = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "JavaScript Gym",
				phone: null,
				description: null,
				latitude: -19.7973334,
				longitude: -43.9699836,
			});

		expect(response.statusCode).toEqual(201);
	});
});
