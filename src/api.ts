type ApiResponse<T> = { ok: true; data: T } | { ok: false };

export async function getNextEvent(): Promise<ApiResponse<Date | null>> {
	type EventAPIResponse = { event: false } | { event: true; start: string };

	const res = await fetch("/api/getNextEvent", {
		method: "GET",
	});

	if (!res.ok) {
		return { ok: false };
	}

	const data = (await res.json()) as EventAPIResponse;

	if (!data.event) return { ok: true, data: null };

	const date = new Date(data.start);
	return { ok: true, data: date };
}
