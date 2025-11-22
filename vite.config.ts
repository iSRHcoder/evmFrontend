import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // correct for Cloudflare
  build: {
    outDir: "dist", // Cloudflare uses /dist
  },
});
