import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BorrowRecord } from '../types'
import * as booksApi from '../api/books'
import * as borrowingsApi from '../api/borrowings'
import { useAuthStore } from './auth'

export const useBookStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const borrowings = ref<BorrowRecord[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const categoryFilter = ref('')

  const filteredBooks = computed(() => {
    let result = [...books.value]
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query)
      )
    }
    if (categoryFilter.value) {
      result = result.filter((book) => book.category === categoryFilter.value)
    }
    return result
  })

  const categories = computed(() => {
    const categorySet = new Set<string>()
    books.value.forEach((book) => categorySet.add(book.category))
    return Array.from(categorySet).sort()
  })

  async function fetchBooks() {
    loading.value = true
    try {
      books.value = await booksApi.fetchBooks()
    } finally {
      loading.value = false
    }
  }

  async function fetchBorrowings(userId?: number) {
    loading.value = true
    try {
      borrowings.value = await borrowingsApi.fetchBorrowings(userId)
    } finally {
      loading.value = false
    }
  }

  function getBookById(id: number) {
    return books.value.find((book) => book.id === id) || null
  }

  async function addBook(book: Omit<Book, 'id' | 'borrowedBy' | 'available'> & { quantity: number }) {
    loading.value = true
    try {
      const newBook = await booksApi.createBook(book)
      books.value.push(newBook)
    } finally {
      loading.value = false
    }
  }

  async function updateBook(id: number, bookData: Partial<Book>) {
    loading.value = true
    try {
      const updated = await booksApi.updateBook(id, bookData)
      const index = books.value.findIndex((b) => b.id === id)
      if (index !== -1) books.value[index] = updated
    } finally {
      loading.value = false
    }
  }

  async function deleteBook(id: number) {
    loading.value = true
    try {
      await booksApi.deleteBook(id)
      const index = books.value.findIndex((b) => b.id === id)
      if (index !== -1) books.value.splice(index, 1)
    } finally {
      loading.value = false
    }
  }

  async function borrowBook(bookId: number) {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return
    loading.value = true
    try {
      await borrowingsApi.createBorrowing(authStore.currentUser.id, bookId)
      await fetchBooks()
      await fetchBorrowings()
    } finally {
      loading.value = false
    }
  }

  async function returnBook(bookId: number) {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return
    const rec = borrowings.value.find(
      (b) => b.bookId === bookId && b.userId === authStore.currentUser!.id && b.status === 'active'
    )
    if (!rec) return
    loading.value = true
    try {
      await borrowingsApi.returnBorrowing(rec.id)
      await fetchBooks()
      await fetchBorrowings()
    } finally {
      loading.value = false
    }
  }

  function getUserBorrowings(userId: number) {
    return borrowings.value.filter((b) => b.userId === userId)
  }

  return {
    books,
    borrowings,
    loading,
    searchQuery,
    categoryFilter,
    filteredBooks,
    categories,
    fetchBooks,
    fetchBorrowings,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getUserBorrowings
  }
})
