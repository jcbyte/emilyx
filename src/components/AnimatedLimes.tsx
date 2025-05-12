import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import AnimatedLime, { SIZE as CAT_SIZE, edges, type Edge } from "./AnimatedLime";

interface LimeData {
	edge: Edge;
	offset: number;
}

export default function AnimatedLimes({
	transitionDuration = 750,
	outDuration = 2500,
	gapDuration = 3000,
}: {
	transitionDuration?: number;
	outDuration?: number;
	gapDuration?: number;
}) {
	const [limes, setLimes] = useState<Record<string, LimeData>>({});
	const currentTimerRef = useRef<NodeJS.Timeout>(null);

	function addLime() {
		const id = v4();

		const edge = edges[Math.floor(Math.random() * edges.length)];

		let maxOffset = {
			top: window.innerWidth,
			bottom: window.innerWidth,
			left: window.innerHeight,
			right: window.innerHeight,
		}[edge];
		const offset = Math.floor(CAT_SIZE / 2 + Math.random() * (maxOffset - CAT_SIZE / 2));

		setLimes((prev) => {
			const newLimes = { ...prev };
			newLimes[id] = { edge, offset: offset };
			return newLimes;
		});
	}

	function removeLime(id: string) {
		setLimes((prev) => {
			const newLimes = { ...prev };
			delete newLimes[id];
			return newLimes;
		});
	}

	useEffect(() => {
		// Start initial lime after `gapInterval`
		const startTimeout = setTimeout(() => {
			addLime();

			// Then start regular interval
			const interval = setInterval(() => addLime(), transitionDuration * 2 + outDuration + gapDuration);
			currentTimerRef.current = interval;
		}, gapDuration);

		return () => {
			clearTimeout(startTimeout);
			if (currentTimerRef.current) clearInterval(currentTimerRef.current);
		};
	}, []);

	return (
		<>
			{Object.entries(limes).map(([id, data]) => (
				<AnimatedLime
					key={id}
					edge={data.edge}
					offset={data.offset}
					onComplete={() => removeLime(id)}
					outDuration={outDuration}
					transitionDuration={transitionDuration}
				></AnimatedLime>
			))}
		</>
	);
}
