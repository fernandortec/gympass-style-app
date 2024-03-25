import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym: Gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			phone: data.phone ?? "",
			description: data.description ?? "",
			latitude: new Decimal(+data.latitude),
			longitude: new Decimal(+data.longitude),
		};

		this.items.push(gym);

		return gym;
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id);

		if (!gym) return null;

		return gym;
	}
}
