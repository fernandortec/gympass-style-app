import type { Environment } from "vitest";

export default {
	name: "prisma",
	transformMode: "ssr",
	async setup() {
		console.log("setup");

		return {
			async teardown() {
				console.log("teardown");
			},
		};
	},
} satisfies Environment;
