import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BorrowRecord } from '../types'
import { books as initialBooks } from '../mockData/books'
import { borrowings as initialBorrowings } from '../mockData/borrowings'
import { useAuthStore } from './auth'

export const useBookStore = defineStore('books', () => {
  const books = ref<Book[]>(JSON.parse(JSON.stringify(initialBooks)))
  const borrowings = ref<BorrowRecord[]>(JSON.parse(JSON.stringify(initialBorrowings)))
  const loading = ref(false)
  const searchQuery = ref('')
  const categoryFilter = ref('')

  const filteredBooks = computed(() => {
    let result = [...books.value]
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
      )
    }
    
    if (categoryFilter.value) {
      result = result.filter(book => book.category === categoryFilter.value)
    }
    
    return result
  })

  const categories = computed(() => {
    const categorySet = new Set<string>()
    books.value.forEach(book => categorySet.add(book.category))
    return Array.from(categorySet).sort()
  })

  function getBookById(id: number) {
    return books.value.find(book => book.id === id) || null
  }

  function addBook(book: any) {
    loading.value = true
    
    // Simulate API request delay
    setTimeout(() => {
      const newId = Math.max(...books.value.map(b => b.id), 0) + 1
      const newBook: Book = {
        ...book,
        id: newId,
        borrowedBy: [],
        available: book.quantity > 0
      }
      
      books.value.push(newBook)
      loading.value = false
    }, 800)
  }

  function updateBook(id: number, bookData: Partial<Book>) {
    loading.value = true
    
    // Simulate API request delay
    setTimeout(() => {
      const index = books.value.findIndex(book => book.id === id)
      if (index !== -1) {
        // Update book data
        books.value[index] = {
          ...books.value[index],
          ...bookData,
          // Ensure available status reflects quantity and borrowed status
          available: 
            (bookData.quantity !== undefined 
              ? bookData.quantity 
              : books.value[index].quantity) > books.value[index].borrowedBy.length
        }
      }
      loading.value = false
    }, 800)
  }

  function deleteBook(id: number) {
    loading.value = true
    
    // Simulate API request delay
    setTimeout(() => {
      const index = books.value.findIndex(book => book.id === id)
      if (index !== -1) {
        // Only delete if no one has borrowed the book
        if (books.value[index].borrowedBy.length === 0) {
          books.value.splice(index, 1)
        }
      }
      loading.value = false
    }, 800)
  }

  function borrowBook(bookId: number) {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return
    
    loading.value = true
    
    // Simulate API request delay
    setTimeout(() => {
      const book = books.value.find(b => b.id === bookId)
      if (book && book.available) {
        // Update book status
        book.borrowedBy.push(authStore.currentUser!.id)
        book.available = book.borrowedBy.length < book.quantity
        
        // Create borrowing record
        const newBorrowingId = Math.max(...borrowings.value.map(b => b.id), 0) + 1
        const today = new Date().toISOString().split('T')[0]
        
        borrowings.value.push({
          id: newBorrowingId,
          userId: authStore.currentUser!.id,
          bookId: bookId,
          borrowDate: today,
          returnDate: null,
          status: 'active'
        })
      }
      loading.value = false
    }, 800)
  }

  function returnBook(bookId: number) {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return
    
    loading.value = true
    
    // Simulate API request delay
    setTimeout(() => {
      const book = books.value.find(b => b.id === bookId)
      if (book) {
        // Remove user from borrowedBy array
        const index = book.borrowedBy.indexOf(authStore.currentUser!.id)
        if (index !== -1) {
          book.borrowedBy.splice(index, 1)
          book.available = true
          
          // Update borrowing record
          const borrowingIndex = borrowings.value.findIndex(
            b => b.bookId === bookId && 
                 b.userId === authStore.currentUser!.id && 
                 b.status === 'active'
          )
          
          if (borrowingIndex !== -1) {
            borrowings.value[borrowingIndex].returnDate = new Date().toISOString().split('T')[0]
            borrowings.value[borrowingIndex].status = 'returned'
          }
        }
      }
      loading.value = false
    }, 800)
  }

  function getUserBorrowings(userId: number) {
    return borrowings.value.filter(b => b.userId === userId)
  }

  return {
    books,
    borrowings,
    loading,
    searchQuery,
    categoryFilter,
    filteredBooks,
    categories,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getUserBorrowings
  }
})