import type { FastifyInstance, FastifyReply } from "fastify";

import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export async function metrics(app: FastifyInstance): Promise<void> {
	app.get(
		"/check-ins/metrics",
		async (request, reply): Promise<FastifyReply> => {
			const userId = request.user.sub;

			const getUserMetricsUseCase = makeGetUserMetricsUseCase();

			const { checkInsCount } = await getUserMetricsUseCase.execute({
				userId,
			});

			return reply.status(200).send({ checkInsCount });
		},
	);
}
