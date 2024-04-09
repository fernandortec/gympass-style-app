import type { FastifyInstance, FastifyReply } from "fastify";

import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function create(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				body: z.object({
					title: z.string(),
					description: z.string().nullable(),
					phone: z.string().nullable(),
					latitude: z.number().refine((value) => Math.abs(value) <= 90),
					longitude: z.number().refine((value) => Math.abs(value) <= 180),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { description, latitude, longitude, phone, title } = request.body;

			const createGymUseCase = makeCreateGymUseCase();

			await createGymUseCase.execute({
				description,
				latitude,
				longitude,
				phone,
				title,
			});

			return reply.status(201).send();
		},
	);
}
