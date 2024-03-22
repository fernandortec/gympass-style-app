import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "@/use-cases/check-in";
import { beforeEach, describe, expect, it } from "vitest";

let checkInsRepository: CheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInUseCase(checkInsRepository);
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({ gymId: "", userId: "" });

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
