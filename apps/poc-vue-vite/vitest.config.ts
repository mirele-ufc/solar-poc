import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/test/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/mockData.ts",
        "**/types/**",
        "**/mocks/**",
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
