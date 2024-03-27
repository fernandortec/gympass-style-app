import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn } from "@prisma/client";

interface FindUserCheckInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

type FindUserCheckInsHistoryUseCaseResponse = {
	checkIns: CheckIn[];
};

export class FindUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
	}: FindUserCheckInsHistoryUseCaseRequest): Promise<FindUserCheckInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		);

		return { checkIns };
	}
}
