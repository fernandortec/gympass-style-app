import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkOnSameData = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkOnSameData) return null;

		return checkOnSameData;
	}

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.items.find((item) => item.id === id);

		if (!checkIn) return null;
		return checkIn;
	}

	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((item) => item.user_id === userId).length;
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = this.items
			.filter((item) => item.user_id === userId)
			.slice((page - 1) * 20, page * 20);
		return checkIns;
	}

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn: CheckIn = {
			id: randomUUID(),
			gym_id: data.gym_id,
			user_id: data.user_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn;
		}

		return checkIn;
	}
}
