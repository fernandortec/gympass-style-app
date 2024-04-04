import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FindUserCheckInsHistoryUseCase } from "@/use-cases/find-user-check-ins-history";

export function makeFindUserCheckInsHistoryuseCase(): FindUserCheckInsHistoryUseCase {
	const checkInsRepository = new PrismaCheckInsRepository();
	const findUserCheckInsHistoryUseCase = new FindUserCheckInsHistoryUseCase(
		checkInsRepository,
	);

	return findUserCheckInsHistoryUseCase;
}
