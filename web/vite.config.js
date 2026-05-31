import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 部署在 https://meichihch.github.io/gift-of-wellbeing/，base 需對應子路徑。
export default defineConfig({
  base: "/gift-of-wellbeing/",
  plugins: [react()],
});
