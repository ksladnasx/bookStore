import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTheme = defineStore('theme', () => {
    const isdark = ref(false)
    const themeColor = ref('#409EFF')

    // 初始化时读取本地存储
    try {
        const tm = localStorage.getItem("theme")
        if (tm) {
            const theme = JSON.parse(tm)
            themeColor.value = theme.themeColor
            isdark.value = theme.isdark
        }
    } catch (e) {
        // 解析失败时清理本地存储
        localStorage.removeItem("theme")
    }

    // 监听变化，自动持久化
    watch([isdark, themeColor], () => {
        localStorage.setItem("theme", JSON.stringify({
            isdark: isdark.value,
            themeColor: themeColor.value
        }))
    }, { deep: true })

    function updateIsdark() {
        isdark.value = !isdark.value
    }
    function updateThemeColor(color: string) {
        themeColor.value = color
    }

    return {
        isdark,
        themeColor,
        updateIsdark,
        updateThemeColor
    }
})