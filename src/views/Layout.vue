<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { useTheme } from '../stores/theme'
import { useBookStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'

const theme = useTheme()
const isDark = computed(() => theme.isdark)
const route = useRoute()
const bookStore = useBookStore()
const authStore = useAuthStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  bookStore.fetchBooks()
  if (authStore.currentUser) {
    bookStore.fetchBorrowings(authStore.currentUser.id)
  }
})
</script>

<template>
  <div class="layout" :class="{ 'dark-mode': isDark }">
    <header v-show="!isAdminRoute">
      <NavBar :class="{ 'dark-mode': isDark }" v-model:is-dark="isDark" />
    </header>
    
    <main class="main-content" :class="{ 'dark-mode': isDark, 'admin-main': isAdminRoute }">
      <router-view />
    </main>
    
    <footer class="footer" v-show="!isAdminRoute">
      <p :class="{ 'dark-mode': isDark }">{{ $t('app.footer', [new Date().getFullYear()]) }}</p>
    </footer>
  </div>
</template>

<style scoped>
.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  padding-top: 40px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.admin-main {
  padding: 0;
  max-width: none;
  width: 100vw;
  margin: 0;
}

.footer {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}
</style>