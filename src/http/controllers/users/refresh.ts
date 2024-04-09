import type { FastifyInstance } from "fastify";

export async function refresh(app: FastifyInstance): Promise<void> {
	app.patch("/token/refresh", async (request, reply): Promise<void> => {
		await request.jwtVerify({ onlyCookie: true });

		const userId = request.user.sub;

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: userId,
				},
			},
		);
		const refreshToken = await reply.jwtSign(
			{},
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
