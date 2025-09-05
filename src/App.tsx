import { useEffect, useMemo, useState } from "react";

import { motion } from "motion/react";
import { getNextEvent } from "./api";
import Heart from "./assets/heart.svg?react";
import BubbleParticle from "./components/BubbleParticle";
import LimeParticle from "./components/LimeParticle";
import ParticleGenerator from "./components/ParticleGenerator";

const BPM = 70;

interface Time {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

export default function App() {
	const [nextEvent, setNextEvent] = useState<Date | null>(null);
	const [eventStatus, setHeartbeatState] = useState<"loading" | "event" | "none" | "error">("loading");
	const eventLoaded = useMemo(() => eventStatus !== "loading", [eventStatus]);

	const [heartbeatsUntil, setHeartbeatsUntil] = useState<number>(0);
	const together = useMemo(() => Math.floor(heartbeatsUntil) <= 0, [heartbeatsUntil]);
	const [timeUntil, setTimeUntil] = useState<Time>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	// Load timestamp
	useEffect(() => {
		async function loadNextEvent() {
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
		loadNextEvent();
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

		if (eventStatus === "event") {
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
	}, [nextEvent, eventStatus]);

	function getHeartContent(): React.ReactNode {
		if (!eventLoaded) return;

		switch (eventStatus) {
			case "event":
				if (together) {
					return (
						<div className="-translate-y-6">
							<span className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">Together!</span>
						</div>
					);
				} else {
					return (
						<div className="text-white flex flex-col items-center gap-1 -translate-y-4">
							<div className="text-2xl md:text-3xl font-bold drop-shadow-lg">
								{timeUntil.days > 0 && `${timeUntil.days}d `}
								{timeUntil.hours > 0 && `${timeUntil.hours}h`}
							</div>
							<div className="text-xl md:text-2xl font-semibold drop-shadow-lg">
								{timeUntil.minutes > 0 && `${timeUntil.minutes}m `}
								{timeUntil.seconds > 0 && `${timeUntil.seconds}s`}
							</div>
						</div>
					);
				}
			case "none":
				return (
					<div className="text-center scale-[0.9] -translate-y-5">
						<span className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">Nothing planned yet!</span>
					</div>
				);
			case "error":
				return (
					<div className="flex flex-col items-center gap-1 text-center scale-[0.8] -translate-y-5">
						<span className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">Backend Error</span>
						<span className="text-gray-300 text-xl md:text-2xl font-semibold drop-shadow-lg">
							Joel's OAuth token has probably expired
						</span>
					</div>
				);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 pb-16">
			<div className="w-full mx-auto flex flex-col gap-4">
				<motion.div layout className="flex flex-col gap-2">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col gap-1 items-center"
					>
						<span className="text-4xl md:text-6xl font-light text-gray-800">Until we're</span>
						<span className="text-5xl pb-2 md:text-7xl md:pb-4 font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
							Together
						</span>
					</motion.div>

					<div className="relative">
						<motion.div
							className="mx-auto w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl"
							animate={
								eventLoaded
									? {
											opacity: [1, 1, 1],
											scale: [1, 1.05, 1],
											filter: [
												"drop-shadow(0 10px 30px rgba(244, 63, 94, 0.3))",
												"drop-shadow(0 15px 40px rgba(244, 63, 94, 0.4))",
												"drop-shadow(0 10px 30px rgba(244, 63, 94, 0.3))",
											],
									  }
									: {
											opacity: [1, 0.5, 1],
									  }
							}
							transition={{
								duration: eventLoaded ? 60 / BPM : 1.5,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<Heart />

							<div className="absolute inset-0 flex items-center justify-center px-4">
								<motion.div
									// To show new animation on content changes
									key={`heartContent-${eventStatus}-${together}`}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", bounce: 0.5 }}
								>
									{getHeartContent()}
								</motion.div>
							</div>

							{eventLoaded && <ParticleGenerator Particle={BubbleParticle} emissionRate={400} />}
						</motion.div>
					</div>
				</motion.div>

				{eventStatus === "event" && !together && (
					<div className="flex flex-col gap-2">
						<motion.div
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-black/8 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-lg border border-rose-200/50 max-w-md mx-auto flex flex-col gap-1 items-center"
						>
							<span className="text-2xl font-bold text-gray-800">{Math.floor(heartbeatsUntil).toLocaleString()}</span>
							<span className="text-sm text-gray-700">heartbeats until we're together</span>
						</motion.div>

						<motion.div
							layout
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0 }}
							className="flex justify-center"
						>
							<span className="text-gray-600 text-sm">
								{nextEvent?.toLocaleString("en-GB", {
									weekday: "short",
									day: "numeric",
									month: "short",
									hour: "2-digit",
									minute: "2-digit",
								}) ?? "Unknown Date"}
							</span>
						</motion.div>
					</div>
				)}
			</div>

			<ParticleGenerator Particle={LimeParticle} emissionRate={5500} delay={3500} />
		</div>
	);
}
