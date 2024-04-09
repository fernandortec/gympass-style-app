import type { FastifyReply, FastifyRequest } from "fastify";

type VerifyReturn = (
	request: FastifyRequest,
	reply: FastifyReply,
) => Promise<void | FastifyReply>;

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER"): VerifyReturn {
	return async (
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void | FastifyReply> => {
		const { role } = request.user;

		if (role !== roleToVerify)
			return reply.status(401).send({ message: "Unauthorized" });

		return;
	};
}
