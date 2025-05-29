export interface User {
  id: number
  username: string
  password: string
  name: string
  role: 'admin' | 'user'
  email: string
  borrowedBooks: number[]
}

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  publishYear: number
  category: string
  description: string
  coverImage: string
  available: boolean
  quantity: number
  borrowedBy: number[]
}

export interface BorrowRecord {
  id: number
  userId: number
  bookId: number
  borrowDate: string
  returnDate: string | null
  status: 'active' | 'returned' | 'overdue'
}

export interface LoginCredentials {
  username: string
  password: string
}