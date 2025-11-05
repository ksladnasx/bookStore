/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  test: {
    // 启用类似 Jest 的全局 API
    globals: true,
    // 模拟 DOM 环境
    environment: "jsdom", // 或 'happy-dom'
    	
    exclude: ['node_modules'],

    watch: true, // 开启监听模式，监听文件变化并自动运行测试
    // 解决 Unknown file extension ".css" 错误
    server: {
      deps: {
        // 将 element-plus 及其主题包列为需要内联处理的依赖
        inline: ['element-plus', 'element-plus/theme-chalk'],
      },
    },

     coverage: {
      provider: 'v8', // 或 'istanbul'
      reporter: ['text', 'html', 'json'], // 在控制台、HTML文件等多种格式输出报告
      reportsDirectory: './coverage', // 报告输出目录
      exclude: ['tests/**'], // 排除测试文件本身
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
