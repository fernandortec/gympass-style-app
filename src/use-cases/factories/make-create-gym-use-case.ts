import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "@/use-cases/create-gym";

export function makeCreateGymUseCase(): CreateGymUseCase {
	const gymsRepository = new PrismaGymsRepository();
	const createGymUseCase = new CreateGymUseCase(gymsRepository);

	return createGymUseCase;
}
