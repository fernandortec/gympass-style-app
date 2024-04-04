import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function profile(app: FastifyInstance): Promise<void> {
	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			"/me",
			{
				schema: {
					response: {
						200: z.object({
							user: z.object({
								created_at: z.date(),
								email: z.string().email(),
								id: z.string().uuid(),
								name: z.string(),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const getUserProfile = makeGetUserProfileUseCase();

				const { user } = await getUserProfile.execute({
					userId: request.user.sub,
				});

				return reply.status(200).send({ user });
			},
		)
		.addHook("onRequest", verifyJWT);
}
