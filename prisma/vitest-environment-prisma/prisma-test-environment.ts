import { PrismaClient } from "@prisma/client";
import "dotenv/config";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Environment } from "vitest";

const prisma = new PrismaClient()

const generateDatabaseUrl = (schema: string): string => {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL environment variable.");
	}

	const url = new URL(process.env.DATABASE_URL);
	url.searchParams.set("schema", schema);

	return url.toString();
};

export default {
	name: "prisma",
	transformMode: "ssr",
	async setup() {
		const schema = randomUUID();
		const databaseURL = generateDatabaseUrl(schema);

		process.env.DATABASE_URL = databaseURL;

		execSync("pnpm prisma migrate deploy")

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
				await prisma.$disconnect()
			},
		};
	},
} satisfies Environment;
