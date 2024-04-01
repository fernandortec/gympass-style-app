import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/helpers/get-distance-between-coordinates";
import type {
	FindManyNearbyParams,
	GymsRepository,
} from "@/repositories/gyms-repository";
import type { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym: Gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			phone: data.phone ?? null,
			description: data.description ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
		};

		this.items.push(gym);

		return gym;
	}

	async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber(),
				},
			);

			return distance < 10;
		});
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id);

		if (!gym) return null;

		return gym;
	}
}
