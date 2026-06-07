import { google } from "googleapis";

import dotenv from "dotenv";
dotenv.config();

export default async function (req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	// Authorise the OAuth2 client with credentials created and given via environment variable
	const authClient = new google.auth.OAuth2({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.CLIENT_REDIRECT,
	});

	if (!process.env.ACCESS_TOKEN) {
		return res.status(500).json({ message: "ACCESS_TOKEN Not Available" });
	}

	const token = JSON.parse(process.env.ACCESS_TOKEN);
	authClient.setCredentials(token);

	const calendar = google.calendar({ version: "v3", auth: authClient });

	const excludedEvents = process.env.EXCLUDED_RECURRING_IDS?.split(",") ?? [];

	// Search for future events with "Emily" in the title
	let calendar_res;
	try {
		calendar_res = await calendar.events.list({
			calendarId: "primary",
			timeMin: new Date().toISOString(),
			// In case the next n events are all excluded
			maxResults: 1 + excludedEvents.length,
			singleEvents: true,
			orderBy: "startTime",
			eventTypes: "default", // Exclude birthday events
			q: "Emily",
		});
	} catch {
		return res.status(503).json({ message: "OAuth2 disallowed" });
	}

	// Extract the next event, which is not excluded
	const events = calendar_res.data.items;
	console.log(events);
	const nextEmilyEvent = events.find((e) => !(e.recurringEventId && excludedEvents.includes(e.recurringEventId)));

	if (!nextEmilyEvent || !nextEmilyEvent.start) {
		return res.status(200).json({ event: false });
	}

	// Return the time of the next event
	// If it is an all-day event, return the day start
	const eventStart = nextEmilyEvent.start.dateTime ?? `${nextEmilyEvent.start.date}T00:00:00.000Z`;
	return res.status(200).json({ event: true, start: eventStart });
}
