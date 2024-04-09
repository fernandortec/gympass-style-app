import type { FastifyInstance, FastifyReply } from "fastify";

import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function search(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/gyms/search",
		{
			schema: {
				querystring: z.object({
					q: z.string(),
					page: z.coerce.number().min(1).default(1),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { page, q } = request.query;

			const searchGymsUseCase = makeSearchGymsUseCase();

			const gyms = await searchGymsUseCase.execute({
				page,
				query: q,
			});

			return reply.status(200).send({ gyms });
		},
	);
}
