import { useEffect, useState } from "react";

import Heart from "./assets/heart.svg?react";
import { getTimestamp } from "./firebase/firestore";

const BPM = 70;

export default function App() {
	const [heartbeats, setHeartbeats] = useState<number>();
	const [heartbeatsLoaded, setHeartbeatsLoaded] = useState<boolean>(false);

	const [isBeating, setIsBeating] = useState<boolean>(false);

	// Load timestamp
	useEffect(() => {
		getTimestamp().then((timestamp) => {
			let remaining = timestamp - Date.now();
			let remainingHeartbeats = (remaining / 1000 / 60) * BPM;
			setHeartbeats(remainingHeartbeats);
			setHeartbeatsLoaded(true);
		});
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
			<div className="flex flex-col items-center justify-center gap-6 mt-24">
				<h1 className="text-3xl font-bold text-pink-600 text-center">Heartbeats until I see you again!</h1>

				<div className="relative">
					<Heart
						className={`h-48 w-48 fill-pink-400 stroke-pink-600 transition-all duration-200 ${
							isBeating ? "scale-110" : "scale-100"
						}`}
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						{/* Bottom padding to make the text "look" more central */}
						<p className="text-fuchsia-50 font-bold text-xl pb-4">
							{heartbeats && (heartbeats > 0 ? Math.floor(heartbeats).toLocaleString() : "We're Here!")}
						</p>
					</div>
				</div>

				<p className="text-lg text-pink-700">
					{heartbeats
						? heartbeats > 0
							? `That's ${Math.floor(heartbeats / BPM / 60)} hours and ${Math.floor(
									(heartbeats / BPM) % 60
							  )} minutes from now x`
							: "Every heartbeat was for this moment x"
						: "Working it out for you x"}
				</p>
			</div>
		</>
	);
}
