import type { FastifyInstance, FastifyReply } from "fastify";

import { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function register(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply): Promise<FastifyReply> => {
			const { email, name, password } = request.body;

			try {
				const registerUseCase = makeRegisterUseCase();

				await registerUseCase.execute({ email, name, password });
			} catch (error) {
				if (error instanceof ResourceAlreadyExistsError) {
					return reply.status(409).send({ message: error.message });
				}

				throw error;
			}

			return reply.status(201).send();
		},
	);
}
