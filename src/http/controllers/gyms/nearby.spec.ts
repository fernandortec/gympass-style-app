import { app } from "@/app";
import { createAndAuthenticateUser } from "@/helpers/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Nearby gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to find gyms nearby", async () => {
		const { token } = await createAndAuthenticateUser(app,true);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Near Gym",
				phone: null,
				description: null,
				latitude: -19.7973334,
				longitude: -43.9699836,
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Far Gym",
				phone: null,
				description: null,
				latitude: -19.6407159,
				longitude: -45.167319,
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({ latitude: -19.7973334, longitude: -43.9699836 })
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: "Near Gym" }),
		]);
	});
});
