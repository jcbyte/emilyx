export async function getNextEvent(): Promise<Date | null | "error"> {
	type EventAPIResponse = { event: false } | { event: true; start: string };

	const res = await fetch("/api/getNextEvent", {
		method: "GET",
	});

	if (!res.ok) {
		return "error";
	}

	const data = (await res.json()) as EventAPIResponse;

	if (!data.event) return null;

	const date = new Date(data.start);
	return date;
}
