// src/i18n.ts
import { createI18n } from 'vue-i18n'; // 确保从 'vue-i18n' 导入;
import en from '../locales/en.json';
import zh from '../locales/zh.json';

// 定义语言包类型
type MessageSchema = typeof zh;

export const i18n = createI18n<[MessageSchema], 'zh' | 'en'>({
  legacy: false,          // 启用 Composition API
  locale: localStorage.getItem("language") || "zh",           // 默认语言
  fallbackLocale: 'en',   // 回退语言
  messages: {  zh ,en}    // 合并语言包
});
