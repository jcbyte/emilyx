export async function getNextEvent(): Promise<null | Date> {
	type EventAPIResponse = { event: false } | { event: true; start: string };

	const res = (await fetch("/api/getNextEvent", {
		method: "GET",
	}).then((res) => res.json())) as EventAPIResponse;

	if (!res.event) return null;

	const date = new Date(res.start);
	return date;
}
