import { useEffect, useState } from "react";

import Heart from "./assets/heart.svg?react";
import { cn } from "./util";

const BPM = 70;

export default function App() {
	const [heartbeats, setHeartbeats] = useState(100000); // todo load initial
	const [isBeating, setIsBeating] = useState(false);

	// Heart beat animation effect
	useEffect(() => {
		const beatInterval = setInterval(() => {
			setIsBeating(true);
			setHeartbeats((prev) => prev - 1);
			setTimeout(() => setIsBeating(false), 200);
		}, (60 / BPM) * 1000);

		return () => clearInterval(beatInterval);
	}, []);

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-6">
				<h1 className="text-3xl font-bold text-pink-600 text-center">Heartbeats until I see you again</h1>

				<div className="relative">
					<Heart
						className={cn(
							"h-48 w-48 fill-pink-400 stroke-pink-600 transition-all duration-200",
							isBeating ? "scale-110" : "scale-100"
						)}
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						{/* Bottom padding to make the text "look" more central */}
						<p className="text-fuchsia-50 font-bold text-xl pb-4">{heartbeats.toLocaleString()}</p>
					</div>
				</div>

				<p className="text-lg text-pink-700">
					That's {Math.floor(heartbeats / BPM / 60)} hours and {Math.floor((heartbeats / BPM) % 60)} minutes from now x
				</p>
			</div>
		</>
	);
}
