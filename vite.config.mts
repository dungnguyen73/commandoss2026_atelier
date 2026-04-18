import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/commandoss2026_atelier/",
  plugins: [react(), tailwindcss()],
});
