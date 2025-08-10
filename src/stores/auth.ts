import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types'
import users from '../mockData/users'

export const useAuthStore = defineStore('auth', () => {
  const user = localStorage.getItem('user')
  const activeIndex = ref('1')
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')
  if (user) {
    currentUser.value = JSON.parse(user) as User
  }
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  //更换路由索引的函数
  function changeactiveIndex(val: string) {
    activeIndex.value = val
  }

  function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''

    // Simulate API request delay
    setTimeout(() => {
      const user = users.find(
        u => u.username === credentials.username && u.password === credentials.password
      )
      

      if (user) {
        // Don't include password in the stored user object
        const { password, ...userWithoutPassword } = user
        currentUser.value = { ...userWithoutPassword, password: '' }
        localStorage.setItem('user', JSON.stringify(currentUser.value))
        loading.value = false
      } else {
        error.value = 'Invalid username or password'
        loading.value = false
      }
    }, 800)
  }

  function logout() {
    localStorage.removeItem('user')
    currentUser.value = null
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    isAdmin, activeIndex, changeactiveIndex,
    login,
    logout
  }
})