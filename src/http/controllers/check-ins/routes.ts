import { create } from "@/http/controllers/check-ins/create";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function checkInsRoutes(app: FastifyInstance): Promise<void> {
	app.addHook("onRequest", verifyJWT);

	app.register(create);
}
