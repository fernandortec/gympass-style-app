import { authenticate } from "@/http/controllers/authenticate";
import { register } from "@/http/controllers/register";
import type { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
	app.register(register);
	app.register(authenticate);
}
