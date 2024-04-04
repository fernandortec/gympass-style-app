import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn, Prisma } from "@prisma/client";

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {}
	async save(checkIn: CheckIn): Promise<CheckIn> {}
	async findById(id: string): Promise<CheckIn | null> {}
	async countByUserId(userId: string): Promise<number> {}
	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {}
	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {}
}
