/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 👇 REQUIRED for GitHub Pages
  base: "/Stellar-swap-testing-L-3/",

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});