<template>
  <div class="theme-switcher">
    <!-- <span>{{ $t('theme-switcher') }}:</span> -->
    <!-- 通过 store 的 isdark 绑定 el-switch -->
    <el-switch v-model="isdark" inline-prompt 
    :active-icon="Moon" :inactive-icon="Sunny" 
    :title="isdark?$t('theme-switcher2'):$t('theme-switcher')" />
    <!-- 通过 store 的 themeColor 绑定 el-color-picker -->
    <el-color-picker v-model="themeColor" 
    :title="$t('color-picker')"
    />
  </div>
</template>

<script setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useElementPlusTheme } from 'use-element-plus-theme'
import { useTheme } from '../stores/theme'
import { onMounted, watch } from 'vue'
// 获取主题 store
const themeStore = useTheme()
// 使用 storeToRefs 保证响应式
const { isdark, themeColor } = storeToRefs(themeStore)

// 实例化主题切换方法
const { changeTheme } = useElementPlusTheme(themeColor.value)


if (isdark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }


// 切换主题色
watch(themeColor, (newColor) => {
  changeTheme(newColor)
  themeStore.updateThemeColor(newColor)
})

// 监听 isdark 的变化，切换暗黑模式
watch(isdark, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})


</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>