import { resolve } from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    env: {
      VITE_API_URL: "http://localhost:8000",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/pages/**", "src/hooks/**", "src/lib/**"],
    },
  },
});
