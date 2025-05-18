import { useEffect, useRef, useState } from "react";
import limeImg from "../assets/lime.png";

export const edges = ["top", "bottom", "left", "right"] as const;
export type Edge = (typeof edges)[number];

export const SIZE = 80;

export default function AnimatedLime({
	edge,
	offset,
	outDuration = 1000,
	transitionDuration = 1000,
	onComplete,
}: {
	edge: Edge;
	offset: number;
	outDuration?: number;
	transitionDuration?: number;
	onComplete?: () => void;
}) {
	const [out, setOut] = useState<boolean>(false);
	const currentTimerRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		// Wait until the next paint to start transition
		const animationStart = requestAnimationFrame(() => {
			setOut(true);

			currentTimerRef.current = setTimeout(() => {
				setOut(false);

				currentTimerRef.current = setTimeout(() => {
					if (onComplete) onComplete();
				}, transitionDuration);
			}, transitionDuration + outDuration);
		});

		return () => {
			if (currentTimerRef.current) clearTimeout(currentTimerRef.current);
			cancelAnimationFrame(animationStart);
		};
	}, []);

	function getClass() {
		return {
			top: `-translate-x-1/2 rotate-180 ${out ? "-top-3" : "-top-20"}`,
			bottom: `-translate-x-1/2 rotate-0 ${out ? "-bottom-3" : "-bottom-20"}`,
			left: `-translate-y-1/2 rotate-75 ${out ? "-left-3" : "-left-20"}`,
			right: `-translate-y-1/2 -rotate-75 ${out ? "-right-3" : "-right-20"}`,
		}[edge];
	}

	const style: React.CSSProperties = {
		transitionDuration: `${transitionDuration}ms`,
		width: SIZE,
		height: SIZE,
		...{
			top: { left: offset },
			bottom: { left: offset },
			left: { top: offset },
			right: { top: offset },
		}[edge],
	};

	return <img src={limeImg} alt="Lime" className={`fixed transition-all ease-in-out ${getClass()}`} style={style} />;
}
