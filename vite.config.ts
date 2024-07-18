import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import * as path from "path";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, "src/assets/svg")], // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  // esbuild: false,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局变量
        additionalData: '@use "./src/assets/style/global-variables.scss" as *;',
      },
    },
  },
  base: "./",

  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
