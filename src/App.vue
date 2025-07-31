<script>
// const shouldShowSidebar = () => {
//   const currentRouteName = router.currentRoute.value.name
//   const publicRoutes = ['homepage'] // 这里为实际的路由的组件名称（“name:”部分）
  
//   // 如果当前路由名称存在且在公共路由列表中，则不显示侧边栏
//   return !(currentRouteName && publicRoutes.includes(currentRouteName as string))
// }
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import { onMounted, ref } from 'vue';
import { useTheme } from './stores/theme';
 const isDark = ref(false)
onMounted(()=>{
  const theme = useTheme(); 
  isDark.value= computed(() => theme.isdark);
})


</script>

<template>
  <div >
    <el-config-provider>
      
     <router-view/>
   </el-config-provider>
  </div>
  
</template>

<style>

#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}
#app.dark-mode{
  background-color: rgb(35, 39, 47) !important;
  color: #e0e0e0 !important;
}

</style>