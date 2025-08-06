import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths"; // ✅ import this

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(), // ✅ use this
  ],
  server: {},
});
