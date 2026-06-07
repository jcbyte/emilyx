import limeImg from "../assets/lime.png";

export default function LimeCounter() {
	// todo correct number
	return (
		<div className="fixed top-2 right-2 flex bg-black/8 backdrop-blur-sm rounded-xl px-4 py-2 gap-2 shadow-lg border border-rose-200/50 max-w-md mx-auto items-center">
			<span className="font-bold text-xl">170</span>
			<img src={limeImg} className="h-6 w-6" />
		</div>
	);
}
