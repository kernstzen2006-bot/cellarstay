import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), tanstackStart({
    server: { entry: "server" },
  }), react(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
});