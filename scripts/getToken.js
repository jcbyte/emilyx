import { google } from "googleapis";
import readline from "readline";

import dotenv from "dotenv";
dotenv.config();

async function getAccessToken() {
	const authClient = new google.auth.OAuth2({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.CLIENT_REDIRECT,
	});

	const authUrl = authClient.generateAuthUrl({
		accessType: "offline",
		scope: ["https://www.googleapis.com/auth/calendar.readonly"],
	});

	console.log("Authorize this app by visiting this url:", authUrl);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question("Enter the redirect URL: ", async (url) => {
		rl.close();

		const inputUrl = new URL(url);
		const code = inputUrl.searchParams.get("code");

		if (!code) {
			throw new Error("Unable to extract code");
		}

		const { tokens } = await authClient.getToken(code);
		authClient.setCredentials(tokens);

		console.log();
		console.log("Token:\n", JSON.stringify(tokens));
	});
}

getAccessToken();
