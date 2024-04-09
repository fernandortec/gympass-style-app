import { create } from "@/http/controllers/gyms/create";
import { nearby } from "@/http/controllers/gyms/nearby";
import { search } from "@/http/controllers/gyms/search";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function gymsRoutes(app: FastifyInstance): Promise<void> {
	app.addHook("onRequest", verifyJWT);

	app.register(nearby)
	app.register(search)
	app.register(create)
}
