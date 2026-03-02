import { api } from './client'
import type { User, LoginCredentials } from '../types'

export interface LoginResponse {
  user: Omit<User, 'password'> & { password: '' }
}

export function login(credentials: LoginCredentials) {
  return api.post<LoginResponse>('/auth/login', credentials).then((res) => res.data)
}

export function logout() {
  return api.post<{ message: string }>('/auth/logout').catch(() => ({}))
}

export interface RegisterPayload {
  username: string
  password: string
  name?: string
  email?: string
}

export function register(payload: RegisterPayload) {
  return api.post<{ message: string }>('/auth/register', payload).then((res) => res.data)
}

export function updateUserProfile(userId: number, payload: { name?: string; email?: string; password?: string }) {
  return api.patch<Omit<User, 'password'> & { password: '' }>(`/users/${userId}`, payload).then((res) => res.data)
}
