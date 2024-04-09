import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

import type { FastifyInstance } from "fastify";
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
				response: {
					200: z.object({
						token: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			try {
				const authenticateUseCase = makeAuthenticateUseCase();

				const { user } = await authenticateUseCase.execute({
					email,
					password,
				});

				const token = await reply.jwtSign(
					{},
					{
						sign: {
							sub: user.id,
						},
					},
				);
				const refreshToken = await reply.jwtSign(
					{},
					{
						sign: {
							sub: user.id,
							expiresIn: "7d",
						},
					},
				);

				return reply
					.setCookie("refreshToken", refreshToken, {
						path: "/",
						secure: true,
						sameSite: true,
						httpOnly: true,
					})
					.status(200)
					.send({ token: token });
			} catch (error) {
				if (error instanceof InvalidCredentialsError) {
					return reply.status(400).send({ message: error.message });
				}

				throw error;
			}
		},
	);
}
