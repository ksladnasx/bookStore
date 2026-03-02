import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types'

export type UserUpdatePayload = Partial<Pick<User, 'name' | 'email' | 'password'>>

export const useAuthStore = defineStore('auth', () => {
  const user = localStorage.getItem('user')
  const activeIndex = ref('1')
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')
  if (user) {
    try {
      currentUser.value = JSON.parse(user) as User
    } catch {
      currentUser.value = null
    }
  }
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function changeactiveIndex(val: string) {
    activeIndex.value = val
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = ''
    try {
      const data = await authApi.login(credentials)
      currentUser.value = { ...data.user, password: '' } as User
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Invalid username or password'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    currentUser.value = null
    authApi.logout().catch(() => {})
  }

  async function updateProfile(payload: UserUpdatePayload): Promise<boolean> {
    if (!currentUser.value) return false
    try {
      const updated = await authApi.updateUserProfile(currentUser.value.id, payload)
      currentUser.value = { ...updated, password: '' } as User
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      return true
    } catch {
      return false
    }
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    isAdmin, activeIndex, changeactiveIndex,
    login,
    logout,
    updateProfile
  }
})