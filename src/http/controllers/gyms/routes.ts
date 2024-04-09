import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function gymsRoutes(app: FastifyInstance): Promise<void> {
	app.addHook("onRequest", verifyJWT);
}
