import { api } from './client'
import type { Book } from '../types'

export function fetchBooks() {
  return api.get<Book[]>('/books').then((res) => res.data)
}

export function fetchBookById(id: number) {
  return api.get<Book>(`/books/${id}`).then((res) => res.data)
}

export function createBook(book: Omit<Book, 'id' | 'borrowedBy' | 'available'> & { quantity: number }) {
  const payload = {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publishYear: book.publishYear,
    category: book.category,
    description: book.description,
    coverImage: book.coverImage,
    quantity: book.quantity
  }
  return api.post<Book>('/books', payload).then((res) => res.data)
}

export function updateBook(id: number, data: Partial<Book>) {
  const payload: Record<string, unknown> = {}
  if (data.title !== undefined) payload.title = data.title
  if (data.author !== undefined) payload.author = data.author
  if (data.isbn !== undefined) payload.isbn = data.isbn
  if (data.publishYear !== undefined) payload.publishYear = data.publishYear
  if (data.category !== undefined) payload.category = data.category
  if (data.description !== undefined) payload.description = data.description
  if (data.coverImage !== undefined) payload.coverImage = data.coverImage
  if (data.quantity !== undefined) payload.quantity = data.quantity
  return api.put<Book>(`/books/${id}`, payload).then((res) => res.data)
}

export function deleteBook(id: number) {
  return api.delete(`/books/${id}`).then(() => undefined)
}
