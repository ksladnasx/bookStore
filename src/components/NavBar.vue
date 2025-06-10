<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'


const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const currentUser = computed(() => authStore.currentUser)


function handleSelect(key: string) {
  authStore.changeactiveIndex(key)
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2':
      router.push('/books')
      break
    case '3':
      router.push('/my-books')
      break
    case '4':
      router.push('/admin')
      break
    case 'logout':
      logout()
      break
    case 'login':
      router.push('/login')
      break
  }
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <el-menu
    :default-active="authStore.activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    router
  >
    <el-menu-item index="1">系统主页</el-menu-item>
    <el-menu-item index="2">书籍汇总</el-menu-item>
    
    <template v-if="isAuthenticated">
      <el-menu-item index="3">我的借阅</el-menu-item>
      <el-menu-item v-if="isAdmin" index="4">管理面板</el-menu-item>
    </template>
    
    <div class="flex-spacer"></div>
    
    <template v-if="isAuthenticated">
      <el-sub-menu index="user">
        <template #title>
          <el-avatar size="small" :icon="'UserFilled'" />
          <span class="username">{{ currentUser?.name }}</span>
        </template> 
        <el-menu-item index="logout">登出</el-menu-item>
      </el-sub-menu>
    </template>
    
    <template v-else>
      <el-menu-item index="login">登录</el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.flex-spacer {
  flex: 1;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.el-menu-demo {
  display: flex;
}
</style>