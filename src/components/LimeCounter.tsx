import { AnimatePresence, motion } from "motion/react";
import limeImg from "../assets/lime.png";
import useLimeCount from "../hooks/useLimeCount";

export default function LimeCounter() {
	const [limes] = useLimeCount();

	return (
		<motion.div
			initial={{ opacity: 0.5, y: -40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className="fixed top-2 right-2 flex bg-black/8 backdrop-blur-sm rounded-xl px-4 py-2 gap-2 shadow-lg border border-rose-200/50 max-w-md mx-auto items-center"
		>
			<div className="font-bold text-xl relative overflow-hidden h-7 min-w-[1.5rem] flex justify-center items-center">
				<AnimatePresence mode="popLayout">
					<motion.span
						key={limes} // changing the key triggers the exit/entry animation
						initial={{ opacity: 0, y: 15, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -15, scale: 0.8 }}
						transition={{ type: "tween", duration: 0.2 }}
					>
						{limes}
					</motion.span>
				</AnimatePresence>
			</div>
			<img src={limeImg} className="h-6 w-6" />
		</motion.div>
	);
}
