import { useEffect, useMemo, useState } from "react";
import limeImg from "../../assets/lime.png";
import useLimeCount from "../../hooks/useLimeCount";
import useLimeCountShownContext from "../../hooks/useLimeCountShownContext";
import { randomInt } from "../../tools";
import type { ParticleProps } from "../ParticleGenerator";

const edges = ["top", "bottom", "left", "right"] as const;
type Edge = (typeof edges)[number];

interface ParticleData {
	size: number;
	outDuration: number;
	transitionDuration: number;
	clickedTransitionDuration: number;
	edge: Edge;
	offset: number;
	rotation: number;
}

export default function LimeParticle({ onDie }: ParticleProps) {
	// Generate random values
	const pd: ParticleData = useMemo(() => {
		const size = randomInt(60, 100);
		const outDuration = randomInt(400, 1400);
		const transitionDuration = 500;
		const clickedTransitionDuration = 700;
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

		return { size, outDuration, transitionDuration, clickedTransitionDuration, edge, offset, rotation };
	}, []);

	const [particleCreatedTime] = useState<number>(() => performance.now());

	const [out, setOut] = useState<boolean>(false);
	const [animating, setAnimating] = useState<boolean>(true);
	const [pulsing, setPulsing] = useState<boolean>(false);
	const pulseClassName = pulsing ? "opacity-0 scale-200" : "opacity-100 scale-100";

	const { showLimeCounter } = useLimeCountShownContext();
	const [, setLimes] = useLimeCount();

	useEffect(() => {
		let animationFrame: number | null = null;

		const completeOutTime = particleCreatedTime + pd.transitionDuration + pd.outDuration;
		const dieTime = completeOutTime + pd.transitionDuration;

		function animLoop(currentTime: number) {
			if (!animating) return;

			if (currentTime >= dieTime) {
				onDie();
			} else if (currentTime >= completeOutTime) {
				setOut(false);
			} else {
				// On the first paint set `out` to true to ensure initial rendering of `out === false`
				setOut(true);
			}

			animationFrame = requestAnimationFrame(animLoop);
		}

		animationFrame = requestAnimationFrame(animLoop);

		return () => {
			if (animationFrame) cancelAnimationFrame(animationFrame);
		};
	}, [animating, onDie, pd, particleCreatedTime]);

	const className = animating
		? {
				top: `-translate-x-1/2 ${out ? "-top-3" : "-top-20"}`,
				bottom: `-translate-x-1/2 ${out ? "-bottom-3" : "-bottom-20"}`,
				left: `-translate-y-1/2 ${out ? "-left-3" : "-left-20"}`,
				right: `-translate-y-1/2 ${out ? "-right-3" : "-right-20"}`,
			}[pd.edge]
		: // Set size for non-animating in class, to respect screen size
			`w-68 h-68 md:w-92 md:h-92 ${
				{
					top: `-translate-x-1/2 -translate-y-1/2 top-[50%]`,
					bottom: `-translate-x-1/2 translate-y-1/2 bottom-[50%]`,
					left: `-translate-x-1/2 -translate-y-1/2 left-[50%]`,
					right: `translate-x-1/2 -translate-y-1/2 right-[50%]`,
				}[pd.edge]
			}`;

	const style: React.CSSProperties = animating
		? {
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
			}
		: {
				transitionDuration: `${pd.clickedTransitionDuration}ms`,
				rotate: "0deg",
				...{
					top: { left: "50%" },
					bottom: { left: "50%" },
					left: { top: "50%" },
					right: { top: "50%" },
				}[pd.edge],
			};

	function clickLime() {
		if (!animating) return;
		setAnimating(false);
		showLimeCounter();

		// After lime reaches the center, perform a pulse
		setTimeout(() => {
			setPulsing(true);
		}, pd.clickedTransitionDuration);
		// Add to the lime counter (we've collected one), whilst pulsing
		setTimeout(() => {
			setLimes((current) => current + 1);
		}, pd.clickedTransitionDuration * 1.5);
		// After the pulse completes, remove lime
		setTimeout(() => {
			onDie();
		}, pd.clickedTransitionDuration * 2);
	}

	return (
		<img
			src={limeImg}
			alt="Lime"
			onClick={clickLime}
			className={`fixed transition-all ease-in-out ${className} ${pulseClassName}`}
			style={style}
		/>
	);
}
