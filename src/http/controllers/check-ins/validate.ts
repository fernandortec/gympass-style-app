import type { FastifyInstance, FastifyReply } from "fastify";

import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function validate(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/check-ins/:checkInId/validate",
		{
			schema: {
				params: z.object({ checkInId: z.string().uuid() }),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { checkInId } = request.params;

			const validateCheckInUseCase = makeValidateCheckInUseCase();

			await validateCheckInUseCase.execute({
				checkInId,
			});

			return reply.status(204).send();
		},
	);
}
