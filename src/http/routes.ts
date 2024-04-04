import { authenticate } from "@/http/controllers/authenticate";
import { profile } from "@/http/controllers/profile";
import { register } from "@/http/controllers/register";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
	app.register(register);
	app.register(authenticate);
	app.register(profile).addHook("onRequest", verifyJWT);
}
