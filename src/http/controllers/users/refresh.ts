import type { FastifyInstance } from "fastify";

export async function refresh(app: FastifyInstance): Promise<void> {
	app.patch("/token/refresh", async (request, reply): Promise<void> => {
		await request.jwtVerify({ onlyCookie: true });

		const userId = request.user.sub;

		const { role } = request.user;

		const token = await reply.jwtSign(
			{ role },
			{
				sign: {
					sub: userId,
				},
			},
		);
		const refreshToken = await reply.jwtSign(
			{ role },
			{
				sign: {
					sub: userId,
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
	});
}
