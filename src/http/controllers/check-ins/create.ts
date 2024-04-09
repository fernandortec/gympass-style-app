import type { FastifyInstance, FastifyReply } from "fastify";

import { makeCreateCheckInUseCase } from "@/use-cases/factories/make-create-check-in-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function create(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/gyms/:gymId/check-ins",
		{
			schema: {
				body: z.object({
					userLatitude: z.number().refine((value) => Math.abs(value) <= 90),
					userLongitude: z.number().refine((value) => Math.abs(value) <= 180),
				}),
				params: z.object({ gymId: z.string().uuid() }),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { gymId } = request.params;
			const { userLatitude, userLongitude } = request.body;

			const userId = request.user.sub;

			const createCheckInUseCase = makeCreateCheckInUseCase();

			await createCheckInUseCase.execute({
				gymId,
				userId,
				userLatitude,
				userLongitude,
			});

			return reply.status(201).send();
		},
	);
}
