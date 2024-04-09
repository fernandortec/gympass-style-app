import { authenticate } from "@/http/controllers/users/authenticate";
import { profile } from "@/http/controllers/users/profile";
import { refresh } from "@/http/controllers/users/refresh";
import { register } from "@/http/controllers/users/register";
import type { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance): Promise<void> {
	app.register(register);
	app.register(authenticate);
	app.register(profile);
	app.register(refresh)
}
