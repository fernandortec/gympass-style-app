import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "@/use-cases/validate-check-in";

export function makeValidateCheckInUseCase(): ValidateCheckInUseCase {
	const checkInsRepository = new PrismaCheckInsRepository();
	const validateChecValidateCheckInUseCase = new ValidateCheckInUseCase(
		checkInsRepository,
	);

	return validateChecValidateCheckInUseCase;
}
