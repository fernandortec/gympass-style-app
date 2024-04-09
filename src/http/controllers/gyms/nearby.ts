import type { FastifyInstance, FastifyReply } from "fastify";

import { makeFindNearbyGymsUseCase } from "@/use-cases/factories/make-find-nearby-gyms-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function nearby(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/gyms/nearby",
		{
			schema: {
				querystring: z.object({
					latitude: z.number().refine((value) => Math.abs(value) <= 90),
					longitude: z.number().refine((value) => Math.abs(value) <= 180),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { latitude, longitude } = request.query;

			const findNearbyGymsUseCase = makeFindNearbyGymsUseCase();

			const gyms = await findNearbyGymsUseCase.execute({
				userLatitude: latitude,
				userLongitude: longitude,
			});

			return reply.status(200).send({ gyms });
		},
	);
}
