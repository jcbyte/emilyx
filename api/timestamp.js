// todo set timestamp through api
const date = new Date(2025, 5 - 1, 7, 18, 0, 0);
let timestamp = date.getTime();

export default async function (req, res) {
	// If POST then set the timestamp
	if (req.method === "POST") {
		// todo allow to set timestamp
		return res.status(500).json({ message: "Not yet implemented" });

		// Extract the timestamp
		const { timestamp: newTimestamp } = req.body;

		if (newTimestamp) {
			// Save the custom timestamp (ensure it's a valid date string)
			timestamp = new Date(newTimestamp).toISOString();

			return res.status(200).json({ message: "Timestamp saved", timestamp });
		} else {
			return res.status(400).json({ message: "Timestamp is required" });
		}
	}

	// If GET then retrieve the timestamp
	if (req.method === "GET") {
		// Send the timestamp if it exists

		if (timestamp) {
			return res.status(200).json({ timestamp });
		}
		return res.status(404).json({ message: "No timestamp found" });
	}

	return res.status(405).json({ message: "Method Not Allowed" });
}
