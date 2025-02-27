import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-atlas-files",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith(".atlas")) {
            res.setHeader("Content-Type", "application/octet-stream");
          }
          next();
        });
      },
    },
  ],
  assetsInclude: ["**/*.atlas", "**/*.png", "**/*.json"],
});
