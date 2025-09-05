import { motion } from "motion/react";
import { useMemo } from "react";
import { randomInt } from "../tools";
import type { ParticleProps } from "./ParticleGenerator";

interface ParticleData {
	size: number;
	duration: number;
	verticalStartPct: number;
	verticalEndPct: number;
	horizontalStartPct: number;
	horizontalEndPct: number;
}

const PX_PCT = 20;

export default function BubbleParticle({ onDie }: ParticleProps) {
	const pd: ParticleData = useMemo(() => {
		const size = randomInt(2, 12);
		const duration = randomInt(3, 5);
		const verticalStartPct = randomInt(20, 40);
		const verticalEndPct = randomInt(60, 80);
		const horizontalStartPct = randomInt(PX_PCT, 100 - PX_PCT);
		const horizontalEndPct = horizontalStartPct + randomInt(-25, 25);

		return { size, duration, verticalStartPct, verticalEndPct, horizontalStartPct, horizontalEndPct };
	}, []);

	const style: React.CSSProperties = {
		width: pd.size,
		height: pd.size,
		bottom: `${pd.verticalStartPct}%`,
		left: `${pd.horizontalStartPct}%`,
	};

	return (
		<motion.div
			className="absolute bg-rose-300 rounded-full"
			initial={{ opacity: 0, scale: 1 }}
			animate={{
				bottom: `${pd.verticalEndPct}%`,
				left: `${pd.horizontalEndPct}%`,
				opacity: [0, 0.6, 0],
				scale: 0.5,
			}}
			transition={{
				duration: pd.duration,
				ease: "easeOut",
			}}
			style={style}
			onAnimationComplete={onDie}
		/>
	);
}
