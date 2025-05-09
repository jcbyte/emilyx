import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA, type ManifestOptions } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

const manifest: Partial<ManifestOptions> = {
	name: "Emily's Countdown",
	short_name: "Emily's Countdown",
	description: "For my love x",
	start_url: "/",
	display: "standalone",
	background_color: "#f48fb1",
	theme_color: "rgba(0, 0, 0, 0)",
	icons: [
		{ src: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32" },
		{ src: "/icon/icon-192.png", type: "image/png", sizes: "192x192" },
		{ src: "/icon/icon-512.png", type: "image/png", sizes: "512x512" },
		{ src: "/icon/icon-192-maskable.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
		{ src: "/icon/icon-512-maskable.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
	],
	lang: "en",
	scope: "/",
	orientation: "portrait",
};

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), svgr(), VitePWA({ registerType: "autoUpdate", manifest })],
});
