import { env } from "@/env";
import { errorHandler } from "@/error-handler";
import { gymsRoutes } from "@/http/controllers/gyms/routes";
import { usersRoutes } from "@/http/controllers/users/routes";
import fastifyJWT from "@fastify/jwt";
import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

export const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJWT, {
	secret: env.JWT_SECRET,
});
app.setErrorHandler(errorHandler);

app.register(usersRoutes);
app.register(gymsRoutes); 
