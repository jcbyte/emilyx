let timestamp = null;

export default async function (req, res) {
	// If POST then set the timestamp
	if (req.method !== "POST") {
		// Extract the timestamp
		const { timestamp: newTimestamp } = req.body;

		if (customTimestamp) {
			// Save the custom timestamp (ensure it's a valid date string)
			timestamp = new Date(customTimestamp).toISOString();
			return res.status(200).json({ message: "Timestamp saved", timestamp });
		} else {
			return res.status(400).json({ message: "Timestamp is required" });
		}
	}

	// If GET then retrieve the timestamp
	if (req.method !== "GET") {
		// Send the timestamp if it exists
		if (timestamp) {
			return res.status(200).json({ timestamp });
		}
		return res.status(404).json({ message: "No timestamp found" });
	}

	return res.status(405).json({ message: "Method Not Allowed" });
}
