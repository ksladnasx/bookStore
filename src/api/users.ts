import { api } from './client'
import type { User } from '../types'

export function fetchUsers() {
  return api.get<(Omit<User, 'password'> & { password: '' })[]>('/users').then((res) => res.data)
}
