import { defineConfig, loadEnv } from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")
	return {
		define: {
			global: "globalThis",
		},
		optimizeDeps: {
			esbuildOptions: {
				define: {
					global: "globalThis",
				},
			},
		},
		plugins: [
			laravel({
				input: ["resources/sass/app.scss", "resources/js/app.js"],
				refresh: true,
			}),
			react(),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "resources/js"),
			},
		},
		server: {
			host: "0.0.0.0",
			port: 5173,
			hmr: {
				host: "localhost",
				clientPort: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
			},
		},
	}
})