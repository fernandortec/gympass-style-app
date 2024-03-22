import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn, Prisma } from "@prisma/client";

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public checkins: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn: CheckIn = {
			id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.checkins.push(checkIn);

		return checkIn;
	}
}
