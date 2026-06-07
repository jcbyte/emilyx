import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LimeCountShownProvider } from "./hooks/useLimeCountShownContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LimeCountShownProvider>
			<App />
		</LimeCountShownProvider>
	</StrictMode>,
);
