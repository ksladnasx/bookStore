<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'


const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const currentUser = computed(() => authStore.currentUser)


function handleSelect(key: string) {
  if (key === 'logout' || key.endsWith('-logout')) {
    logout()
    return
  }
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
    case '5':
      router.push('/account')
      break
    case '4':
      router.push('/admin')
      break
    case 'login':
      router.push('/login')
      break
    default:
      if (key === 'admin' || key.startsWith('admin')) router.push('/admin')
      break
  }
}

function logout() {
  authStore.logout()
  router.push('/')
}

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('language', locale.value)
}

// 主题切换
import ThemeSwitcher from './ThemeSwitcher.vue'
import { useTheme } from '../stores/theme';

const theme = useTheme();
const isDark = computed(() => theme.isdark);
</script>

<template>
  <el-menu :default-active="authStore.activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router
    :class="{ 'dark-mode': isDark }">
    <el-menu-item index="1">{{ $t('layout1') }}</el-menu-item>
    <el-menu-item index="2">{{ $t('layout2') }}</el-menu-item>
      <template v-if="isAuthenticated">
      <el-menu-item index="3">{{ $t('layout3') }}</el-menu-item>
      <!-- <el-menu-item v-if="isAdmin" index="4">{{ $t('layout4') }}</el-menu-item> -->
    </template>
    <div>
      <ThemeSwitcher v-model:is-dark="isDark" />
    </div>
    <div class="flex-spacer"></div>

    <!-- 右侧操作区 -->

    <div class="navbar-actions">

      <el-menu-item @click="toggleLanguage">
        <span>{{ $t('actions.changeLanguage') }}：</span>
        <el-button class="language-btn" :title="$t('actions.changeLanguage')" circle size="large">
          {{ $i18n.locale === 'zh' ? '🇺🇸' : '🇨🇳' }}
        </el-button>
      </el-menu-item>
      <template v-if="isAuthenticated">
        <el-sub-menu index="user">
          <template #title>
            <div>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            </div>
            <span class="username">{{ currentUser?.name }}</span>
          </template>
          <el-menu-item v-if="isAdmin" index="4">{{ $t('layout4') }}</el-menu-item>
          <el-menu-item index="5">{{ $t('account.nav') }}</el-menu-item>
          <el-menu-item index="logout" @click="logout">{{ $t('logout') }}</el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item index="login">{{ $t('login') }}</el-menu-item>
      </template>
    </div>
  </el-menu>
</template>

<style scoped>
.el-menu-demo {
  display: flex;
  align-items: center;
  padding: 0 24px;
  min-height: 56px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.flex-spacer {
  flex: 1;
}

* {
  /* 禁用鼠标选中 */
  user-select: none;
  /* 标准语法 */
}

.navbar-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.language-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  padding: 0 6px;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}
</style>