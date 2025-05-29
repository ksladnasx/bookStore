import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types'
import users from '../mockData/users'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

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
        loading.value = false
      } else {
        error.value = 'Invalid username or password'
        loading.value = false
      }
    }, 800)
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout
  }
})