import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import type { FastifyInstance, FastifyReply } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function authenticate(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions",
		{
			schema: {
				body: z.object({
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { email, password } = request.body;

			try {
				const authenticateUseCase = makeAuthenticateUseCase();

				await authenticateUseCase.execute({ email, password });
			} catch (error) {
				if (error instanceof InvalidCredentialsError) {
					return reply.status(400).send({ message: error.message });
				}

				throw error;
			}

			return reply.status(200).send();
		},
	);
}
