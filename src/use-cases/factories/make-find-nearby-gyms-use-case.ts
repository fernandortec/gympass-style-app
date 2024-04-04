import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FindNearbyGymsUseCase } from "@/use-cases/find-nearby-gyms";

export function makeFindNearbyGymsUseCase(): FindNearbyGymsUseCase {
	const gymsRepository = new PrismaGymsRepository();
	const findNearbyGymsUseCase = new FindNearbyGymsUseCase(gymsRepository);

	return findNearbyGymsUseCase;
}
