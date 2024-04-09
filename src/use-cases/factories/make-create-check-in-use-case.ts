import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateCheckInUseCase } from "@/use-cases/check-in";

export function makeCreateCheckInUseCase(): CreateCheckInUseCase {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const checkInuseCase = new CreateCheckInUseCase(
		checkInsRepository,
		gymsRepository,
	);

	return checkInuseCase;
}
