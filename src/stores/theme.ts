import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTheme = defineStore('theme',()=>{
    const isdark = ref(false)
    const themeColor = ref('#409EFF')

    function updateIsdark(){
        isdark.value = ! isdark.value
    }
    function updateThemeColor(color:string){
        themeColor.value = color
    }

    return{
        isdark,
        themeColor,
        updateIsdark,
        updateThemeColor
    }
})