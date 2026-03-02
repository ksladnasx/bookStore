import { api } from './client'
import type { BorrowRecord } from '../types'

export function fetchBorrowings(userId?: number) {
  const params = userId != null ? { userId } : {}
  return api.get<BorrowRecord[]>('/borrowings', { params }).then((res) => res.data)
}

export function createBorrowing(userId: number, bookId: number) {
  return api.post<BorrowRecord>('/borrowings', { userId, bookId }).then((res) => res.data)
}

export function returnBorrowing(id: number) {
  return api.put<BorrowRecord>(`/borrowings/${id}/return`).then((res) => res.data)
}
