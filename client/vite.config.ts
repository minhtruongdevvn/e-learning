import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode, command }) => {
   process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
   const PORT = Number(process.env.VITE_PORT);

   return {
      plugins: [react()],
      server: { port: PORT },
   };
});
