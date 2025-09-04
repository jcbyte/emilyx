import { useEffect, useMemo, useState } from "react";
import limeImg from "../assets/lime.png";
import { randomInt } from "../tools";
import type { ParticleOnDieCallback } from "./ParticleGenerator";

const edges = ["top", "bottom", "left", "right"] as const;
type Edge = (typeof edges)[number];

interface ParticleData {
	size: number;
	outDuration: number;
	transitionDuration: number;
	edge: Edge;
	offset: number;
	rotation: number;
}

export default function LimeParticle({ onDie }: { onDie: ParticleOnDieCallback }) {
	// Generate random values
	const pd: ParticleData = useMemo(() => {
		const size = randomInt(60, 100);
		const outDuration = randomInt(400, 1400);
		const transitionDuration = 500;
		const edge = edges[randomInt(0, edges.length)];
		const maxOffset = {
			top: window.innerWidth,
			bottom: window.innerWidth,
			left: window.innerHeight,
			right: window.innerHeight,
		}[edge];
		const offset = randomInt(size / 2, maxOffset - size / 2);
		const rotation = {
			top: randomInt(175, 185),
			bottom: randomInt(-5, 5),
			left: randomInt(75, 90),
			right: randomInt(-90, -75),
		}[edge];

		return { size, outDuration, transitionDuration, edge, offset, rotation };
	}, []);

	const [out, setOut] = useState<boolean>(false);

	useEffect(() => {
		let currentTimeout: NodeJS.Timeout | null = null;

		// Wait until the next paint to start transition to ensure `out === false`
		const animationFrame = requestAnimationFrame(() => {
			setOut(true);

			currentTimeout = setTimeout(() => {
				setOut(false);

				currentTimeout = setTimeout(onDie, pd.transitionDuration);
			}, pd.transitionDuration + pd.outDuration);
		});

		return () => {
			cancelAnimationFrame(animationFrame);
			if (currentTimeout) clearTimeout(currentTimeout);
		};
	}, []);

	const animClass = {
		top: `-translate-x-1/2 ${out ? "-top-3" : "-top-20"}`,
		bottom: `-translate-x-1/2 ${out ? "-bottom-3" : "-bottom-20"}`,
		left: `-translate-y-1/2 ${out ? "-left-3" : "-left-20"}`,
		right: `-translate-y-1/2 ${out ? "-right-3" : "-right-20"}`,
	}[pd.edge];

	const style: React.CSSProperties = {
		transitionDuration: `${pd.transitionDuration}ms`,
		width: pd.size,
		height: pd.size,
		rotate: `${pd.rotation}deg`,
		...{
			top: { left: pd.offset },
			bottom: { left: pd.offset },
			left: { top: pd.offset },
			right: { top: pd.offset },
		}[pd.edge],
	};

	return <img src={limeImg} alt="Lime" className={`fixed transition-all ease-in-out ${animClass}`} style={style} />;
}
