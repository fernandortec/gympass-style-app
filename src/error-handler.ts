import { env } from "@/env";
import type { FastifyInstance, FastifyReply } from "fastify";

import { ZodError } from "zod";

type ErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: ErrorHandler = async (
	error,
	request,
	reply,
): Promise<FastifyReply> => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		//TODO Here we should log to an external tool like DataDog or Sentry
	}

	return reply.status(500).send({ message: "Internal server error." });
};
