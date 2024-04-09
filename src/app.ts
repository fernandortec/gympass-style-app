import { env } from "@/env";
import { errorHandler } from "@/error-handler";
import { checkInsRoutes } from "@/http/controllers/check-ins/routes";
import { gymsRoutes } from "@/http/controllers/gyms/routes";
import { usersRoutes } from "@/http/controllers/users/routes";
import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

export const app = fastify();

app.register(fastifyJWT, {
	secret: env.JWT_SECRET,
	cookie: { cookieName: "refreshToken", signed: false },
	sign: {
		expiresIn: "10m",
	},
});
app.register(fastifyCookie);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);
