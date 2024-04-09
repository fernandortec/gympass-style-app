import type { FastifyInstance, FastifyReply } from "fastify";

import { makeFindUserCheckInsHistoryuseCase } from "@/use-cases/factories/make-find-user-check-ins-history-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function history(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/check-ins/history",
		{
			schema: {
				querystring: z.object({
					page: z.coerce.number().min(1).default(1),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { page } = request.query;
			const userId = request.user.sub;

			const findUserCheckInsHistoryUseCase =
				makeFindUserCheckInsHistoryuseCase();

			const checkIns = await findUserCheckInsHistoryUseCase.execute({
				page,
				userId,
			});

			return reply.status(200).send({ checkIns });
		},
	);
}
