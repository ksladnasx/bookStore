/// <reference types="vite/client" />
// 防止由于 TypeScript 无法识别 .vue 文件的类型导致的报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}