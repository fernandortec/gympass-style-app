import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(
	request: FastifyRequest,
	reply: FastifyReply,
	// biome-ignore lint/suspicious/noConfusingVoidType:
): Promise<void | FastifyReply> {
	try {
		await request.jwtVerify();
	} catch (error) {
		return reply.status(401).send({ message: "Unauthorized" });
	}
}
