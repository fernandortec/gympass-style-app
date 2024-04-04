import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "@/use-cases/check-in";

export function makeCheckInUseCase(): CheckInUseCase {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const checkInuseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

	return checkInuseCase;
}
