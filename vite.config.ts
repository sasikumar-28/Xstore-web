import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // port: 3000, // Changed default port to 3000
    proxy: {
      "/api": {
        // target: "https://login.microsoftonline.com",
        // target: "http://localhost:5000",
        target: "",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api/,""),
      },
    },
  },
});
