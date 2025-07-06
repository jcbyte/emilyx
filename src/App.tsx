import { useEffect, useState } from "react";

import { getNextEvent } from "./api";
import Heart from "./assets/heart.svg?react";
import AnimatedLimes from "./components/AnimatedLimes";

const BPM = 70;

export default function App() {
	const [heartbeats, setHeartbeats] = useState<number>(0);
	const [heartbeatState, setHeartbeatState] = useState<"loading" | "counting" | "none" | "error">("loading");

	const [isBeating, setIsBeating] = useState<boolean>(false);

	async function loadHeartbeats() {
		// Get start time of next event from calendar
		const nextEvent = await getNextEvent();
		if (nextEvent === "error") {
			setHeartbeatState("error");
			return;
		}

		if (!nextEvent) {
			setHeartbeatState("none");
		} else {
			// Calculate heartbeats remaining
			const remaining = nextEvent.getTime() - Date.now();
			const remainingHeartbeats = (remaining / 1000 / 60) * BPM;
			setHeartbeats(remainingHeartbeats);
			setHeartbeatState("counting");
		}
	}

	function handlePageFocus() {
		// Reload timestamp when coming back to the page
		loadHeartbeats();
	}

	// Load timestamp
	useEffect(() => {
		// Initially load timestamp
		loadHeartbeats();

		window.addEventListener("focus", handlePageFocus);
		return () => {
			window.removeEventListener("focus", handlePageFocus);
		};
	}, []);

	// Heart beat animation effect
	useEffect(() => {
		if (heartbeatState === "counting") {
			const beatInterval = setInterval(() => {
				setIsBeating(true);
				setHeartbeats((prev) => prev! - 1);
				setTimeout(() => setIsBeating(false), 200);
			}, (60 / BPM) * 1000);

			return () => clearInterval(beatInterval);
		}
	}, [heartbeatState]);

	function getTimeStr(heartbeats: number): string {
		const hours = Math.floor(heartbeats / BPM / 60);
		const minutes = Math.floor((heartbeats / BPM) % 60);

		const hoursStr = hours <= 0 ? null : `${hours} hour${hours > 1 ? "s" : ""}`;
		const minutesStr = minutes <= 0 ? null : `${minutes} minute${minutes > 1 ? "s" : ""}`;

		// If time <= 1 minute
		if (!hoursStr && !minutesStr) {
			// If time <= 0
			if (heartbeats <= 0) return "This moment was worth every beat";
			return "That's less than a minute more!";
		}

		return `That's only ${hoursStr ?? ""}${hoursStr && minutesStr ? " and " : ""}${minutesStr ?? ""} more!`;
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-6 pt-24 px-2">
				<span className="text-3xl font-semibold text-pink-600 text-center">
					Counting heartbeats until we're together!
				</span>

				<div className="relative">
					<Heart
						className={`h-48 w-48 fill-pink-400 stroke-pink-600 transition-all duration-200 ${
							isBeating ? "scale-110" : "scale-100"
						}`}
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						{/* Bottom padding to make the text "look" more central */}
						<span className="text-fuchsia-50 font-bold text-xl pb-4">
							{heartbeatState === "counting" &&
								(heartbeats > 0 ? Math.floor(heartbeats).toLocaleString() : "We're Here!")}
							{heartbeatState === "none" && "Stunner"}
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 justify-center items-center">
					<span className="text-lg text-pink-700 text-center">
						{heartbeatState === "loading" && "Syncing our heartbeat..."}
						{heartbeatState === "counting" && getTimeStr(heartbeats)}
						{heartbeatState === "none" && "Nothing planned, but I'll see you soon love!"}
						{heartbeatState === "error" && "Joel's OAuth token has probably expired :("}
					</span>
					<span className="text-sm text-pink-700">For Emily x</span>
				</div>
			</div>

			<AnimatedLimes />
		</>
	);
}
