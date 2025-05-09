import { useEffect, useState } from "react";

import Heart from "./assets/heart.svg?react";
import { getTimestamp } from "./firebase/firestore";

const BPM = 70;

export default function App() {
	const [heartbeats, setHeartbeats] = useState<number>();
	const [heartbeatsLoaded, setHeartbeatsLoaded] = useState<boolean>(false);

	const [isBeating, setIsBeating] = useState<boolean>(false);

	async function loadHeartbeats() {
		// Get timestamp from database
		let timestamp = await getTimestamp();

		// Calculate heartbeats remaining
		let remaining = timestamp - Date.now();
		let remainingHeartbeats = (remaining / 1000 / 60) * BPM;

		setHeartbeats(remainingHeartbeats);
		setHeartbeatsLoaded(true);
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
		if (heartbeatsLoaded) {
			const beatInterval = setInterval(() => {
				setIsBeating(true);
				setHeartbeats((prev) => prev! - 1);
				setTimeout(() => setIsBeating(false), 200);
			}, (60 / BPM) * 1000);

			return () => clearInterval(beatInterval);
		}
	}, [heartbeatsLoaded]);

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-6 pt-24 px-2">
				<span className="text-3xl font-semibold text-pink-600 text-center">Counting heartbeats until I see you!</span>

				<div className="relative">
					<Heart
						className={`h-48 w-48 fill-pink-400 stroke-pink-600 transition-all duration-200 ${
							isBeating ? "scale-110" : "scale-100"
						}`}
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						{/* Bottom padding to make the text "look" more central */}
						<span className="text-fuchsia-50 font-bold text-xl pb-4">
							{heartbeats && (heartbeats > 0 ? Math.floor(heartbeats).toLocaleString() : "We're Here!")}
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 justify-center items-center">
					<span className="text-lg text-pink-700 text-center">
						{heartbeats
							? heartbeats > 0
								? `That's only ${Math.floor(heartbeats / BPM / 60)} hours and ${Math.floor(
										(heartbeats / BPM) % 60
								  )} minutes more!`
								: "This moment was worth every beat"
							: "Syncing our heartbeat..."}
					</span>
					<span className="text-sm text-pink-700">For Emily x</span>
				</div>
			</div>
		</>
	);
}
