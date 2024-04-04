import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function profile(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().get("/me", {}, async () => {});
}
