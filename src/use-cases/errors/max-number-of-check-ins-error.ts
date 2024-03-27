export class MaxNumberOfCheckInsErrors extends Error {
	constructor() {
		super("Max numbers of check-ins reached.");
	}
}
