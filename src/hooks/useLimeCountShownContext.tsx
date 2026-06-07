import { createContext, useContext, useState, type ReactNode } from "react";

const LimeCountShownContext = createContext<{ limeCounterShown: boolean; showLimeCounter: () => void } | undefined>(
	undefined,
);

export function LimeCountShownProvider({ children }: { children: ReactNode }) {
	const [limeCounterShown, setLimeCounterShown] = useState<boolean>(false);

	return (
		<LimeCountShownContext.Provider value={{ limeCounterShown, showLimeCounter: () => setLimeCounterShown(true) }}>
			{children}
		</LimeCountShownContext.Provider>
	);
}

export default function useLimeCountShownContext() {
	const context = useContext(LimeCountShownContext);
	if (!context) throw new Error("useLimeCountShownContext must be used within a LimeCountShownProvider");
	return context;
}
