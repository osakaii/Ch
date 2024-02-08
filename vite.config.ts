import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  const config: UserConfig = {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3001,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-router-dom", "react-dom"],
          },
        },
      },
    },
  };
  if (command !== "serve") {
    config.base = "/Ch/";
  }
  return config;
});
