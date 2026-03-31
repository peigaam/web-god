import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["examples/react-hooks/__tests__/**/*.test.ts"],
  },
});
