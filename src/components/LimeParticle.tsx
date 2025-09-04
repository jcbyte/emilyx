import { useEffect, useMemo, useState } from "react";
import limeImg from "../assets/lime.png";
import { randomInt } from "../tools";
import type { ParticleOnDieCallback } from "./ParticleGenerator";

export const edges = ["top", "bottom", "left", "right"] as const;
export type Edge = (typeof edges)[number];

export const SIZE = 80;
export const OUT_DURATION = 1000;
export const TRANSITION_DURATION = 1000;

export default function LimeParticle({ onDie }: { onDie: ParticleOnDieCallback }) {
	// Generate random values
	const edge: Edge = useMemo(() => edges[randomInt(0, edges.length)], []);
	const offset = useMemo(() => {
		const maxOffset = {
			top: window.innerWidth,
			bottom: window.innerWidth,
			left: window.innerHeight,
			right: window.innerHeight,
		}[edge];
		return randomInt(SIZE / 2, maxOffset - SIZE / 2);
	}, [edge]);

	const [out, setOut] = useState<boolean>(false);

	useEffect(() => {
		let currentTimeout: NodeJS.Timeout | null = null;

		// Wait until the next paint to start transition to ensure `out === false`
		const animationFrame = requestAnimationFrame(() => {
			setOut(true);

			currentTimeout = setTimeout(() => {
				setOut(false);

				currentTimeout = setTimeout(onDie, TRANSITION_DURATION);
			}, TRANSITION_DURATION + OUT_DURATION);
		});

		return () => {
			cancelAnimationFrame(animationFrame);
			if (currentTimeout) clearTimeout(currentTimeout);
		};
	}, []);

	const animClass = {
		top: `-translate-x-1/2 rotate-180 ${out ? "-top-3" : "-top-20"}`,
		bottom: `-translate-x-1/2 rotate-0 ${out ? "-bottom-3" : "-bottom-20"}`,
		left: `-translate-y-1/2 rotate-75 ${out ? "-left-3" : "-left-20"}`,
		right: `-translate-y-1/2 -rotate-75 ${out ? "-right-3" : "-right-20"}`,
	}[edge];

	const style: React.CSSProperties = {
		transitionDuration: `${TRANSITION_DURATION}ms`,
		width: SIZE,
		height: SIZE,
		...{
			top: { left: offset },
			bottom: { left: offset },
			left: { top: offset },
			right: { top: offset },
		}[edge],
	};

	return <img src={limeImg} alt="Lime" className={`fixed transition-all ease-in-out ${animClass}`} style={style} />;
}
