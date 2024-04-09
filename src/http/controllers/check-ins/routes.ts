import { create } from "@/http/controllers/check-ins/create";
import { history } from "@/http/controllers/check-ins/history";
import { metrics } from "@/http/controllers/check-ins/metrics";
import { validate } from "@/http/controllers/check-ins/validate";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function checkInsRoutes(app: FastifyInstance): Promise<void> {
	app.addHook("onRequest", verifyJWT);

	app.register(create);
	app.register(history)
	app.register(metrics)
	app.register(validate)
}
