import { useEffect, useState } from "react";

import { getNextEvent } from "./api";
import Heart from "./assets/heart.svg?react";
import AnimatedLimes from "./components/AnimatedLimes";

const BPM = 70;

interface Time {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

export default function App() {
	const [nextEvent, setNextEvent] = useState<Date | null>(null);
	const [heartbeatState, setHeartbeatState] = useState<"loading" | "event" | "none" | "error">("loading");

	const [heartbeatsUntil, setHeartbeatsUntil] = useState<number>(0);
	const [timeUntil, setTimeUntil] = useState<Time>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	// Load timestamp
	useEffect(() => {
		async function loadHeartbeats() {
			// Get next event from calendar
			const nextEventTime = await getNextEvent();
			if (!nextEventTime.ok) {
				setHeartbeatState("error");
				return;
			}

			if (nextEventTime.data === null) setHeartbeatState("none");
			else setHeartbeatState("event");
			setNextEvent(nextEventTime.data);
		}

		// Initially load timestamp
		loadHeartbeats();

		function handlePageFocus() {
			// Reload timestamp when coming back to the page
			loadHeartbeats();
		}

		window.addEventListener("focus", handlePageFocus);
		return () => {
			window.removeEventListener("focus", handlePageFocus);
		};
	}, []);

	function getTimeRemaining(): number | null {
		// Get time until even in milliseconds
		if (!nextEvent) return null;
		return nextEvent.getTime() - Date.now();
	}

	function getHeartbeatsUntil(): number | null {
		const mills = getTimeRemaining();
		if (!mills) return null;

		return (mills / 1000 / 60) * BPM;
	}

	function getTimeUntil(): Time | null {
		const mills = getTimeRemaining();
		if (!mills) return null;

		const secondsTotal = Math.floor(mills / 1000);

		const days = Math.floor(secondsTotal / (24 * 60 * 60));
		const hours = Math.floor((secondsTotal % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((secondsTotal % (60 * 60)) / 60);
		const seconds = secondsTotal % 60;

		return { days, hours, minutes, seconds };
	}

	useEffect(() => {
		let heartbeatInterval: NodeJS.Timeout | null = null;
		let timeInterval: NodeJS.Timeout | null = null;

		if (heartbeatState === "event") {
			function updateHeartbeatsUntil() {
				const heartbeats = getHeartbeatsUntil();
				if (!heartbeats) return;

				setHeartbeatsUntil(heartbeats);
			}

			function updateTimeUntil() {
				const time = getTimeUntil();
				if (!time) return;

				setTimeUntil(time);
			}

			updateHeartbeatsUntil();
			updateTimeUntil();

			heartbeatInterval = setInterval(updateHeartbeatsUntil, (60 / BPM) * 1000);
			timeInterval = setInterval(updateTimeUntil, 1000);
		}

		return () => {
			if (heartbeatInterval) clearInterval(heartbeatInterval);
			if (timeInterval) clearInterval(timeInterval);
		};
	}, [nextEvent, heartbeatState]);

	// todo refresh ui
	// todo heart animation
	// todo handle currently in event
	// todo checkout limes

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-6 pt-24 px-2">
				<span className="text-3xl font-semibold text-pink-600 text-center">
					Counting heartbeats until we're together!
				</span>

				<div className="relative">
					<Heart className="h-48 w-48 fill-pink-400 stroke-pink-600 transition-all duration-200" />
					<div className="absolute inset-0 flex items-center justify-center">
						{/* Bottom padding to make the text look more central */}
						<span className="text-fuchsia-50 font-bold text-xl pb-4">
							{heartbeatState === "event" && Math.floor(heartbeatsUntil).toLocaleString()}
							{heartbeatState === "none" && "Stunner"}
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 justify-center items-center">
					<span className="text-lg text-pink-700 text-center">
						{heartbeatState === "loading" && "Syncing our heartbeat..."}
						{heartbeatState === "event" &&
							`${timeUntil.days}d ${timeUntil.hours}h ${timeUntil.minutes}m ${timeUntil.seconds}s`}
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
