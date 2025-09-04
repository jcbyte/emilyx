import { motion } from "motion/react";

export default function Bubbles({ n = 6, xpad = 0 }: { n?: number; xpad?: number }) {
	const spacing = (100 - 2 * xpad) / (n - 1);
	return (
		<>
			{[...Array(n)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute size-2 bg-rose-300 rounded-full"
					animate={{
						y: [-20, -80],
						x: [0, Math.sin(i) * 40],
						opacity: [0, 0.6, 0],
						scale: [1, 0.5],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						delay: i * 0.5,
						ease: "easeOut",
					}}
					style={{
						left: `${xpad + i * spacing}%`,
						top: "70%",
					}}
				/>
			))}
		</>
	);
}
