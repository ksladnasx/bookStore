<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const authStore = useAuthStore()

const bookId = computed(() => parseInt(route.params.id as string))
const book = computed(() => bookStore.getBookById(bookId.value))
const loading = ref(true)
const borrowLoading = ref(false)
const returnLoading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const hasBorrowed = computed(() => {
  if (!authStore.currentUser || !book.value) return false
  return book.value.borrowedBy.includes(authStore.currentUser.id)
})

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    if (!book.value) {
      router.push('/books')
      ElMessage.error('Book not found')
    }
    loading.value = false
  }, 800)
})

function borrowBook() {
  if (!isAuthenticated.value) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  
  borrowLoading.value = true
  bookStore.borrowBook(bookId.value)
  
  setTimeout(() => {
    borrowLoading.value = false
    ElMessage.success('Book borrowed successfully')
  }, 800)
}

function returnBook() {
  returnLoading.value = true
  bookStore.returnBook(bookId.value)
  
  setTimeout(() => {
    returnLoading.value = false
    ElMessage.success('Book returned successfully')
  }, 800)
}

function editBook() {
  router.push(`/admin/books/edit/${bookId.value}`)
}

function confirmDelete() {
  ElMessageBox.confirm(
    'Are you sure you want to delete this book? This action cannot be undone.',
    'Delete Book',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      bookStore.deleteBook(bookId.value)
      ElMessage.success('Book deleted successfully')
      router.push('/books')
    })
    .catch(() => {
      // User cancelled
    })
}
</script>

<template>
  <div class="book-detail-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="book-detail-skeleton">
          <div class="book-image-skeleton">
            <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
          </div>
          <div class="book-info-skeleton">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 30%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 60%" />
          </div>
        </div>
      </template>
      
      <template #default>
        <div v-if="book" class="book-detail">
          <div class="book-image-container">
            <img :src="book.coverImage" alt="Book cover" class="book-image" />
          </div>
          
          <div class="book-info">
            <div class="book-header">
              <h1>{{ book.title }}</h1>
              <div class="book-actions" v-if="isAdmin">
                <el-button type="primary" plain @click="editBook">
                  Edit Book
                </el-button>
                <el-button type="danger" plain @click="confirmDelete">
                  Delete Book
                </el-button>
              </div>
            </div>
            
            <p class="book-author">By {{ book.author }}</p>
            
            <div class="book-tags">
              <el-tag>{{ book.category }}</el-tag>
              <el-tag 
                :type="book.available ? 'success' : 'danger'" 
                effect="dark"
              >
                {{ book.available ? 'Available' : 'Unavailable' }}
              </el-tag>
              <el-tag type="info">{{ book.publishYear }}</el-tag>
            </div>
            
            <div class="book-meta">
              <p><strong>ISBN:</strong> {{ book.isbn }}</p>
              <p><strong>Quantity:</strong> {{ book.quantity }}</p>
              <p><strong>Availability:</strong> {{ book.quantity - book.borrowedBy.length }} of {{ book.quantity }} available</p>
            </div>
            
            <el-divider />
            
            <div class="book-description">
              <h3>Description</h3>
              <p>{{ book.description }}</p>
            </div>
            
            <div class="borrow-section" v-if="isAuthenticated && !isAdmin">
              <el-button 
                v-if="!hasBorrowed" 
                type="primary" 
                :disabled="!book.available"
                :loading="borrowLoading"
                @click="borrowBook"
              >
                Borrow Book
              </el-button>
              
              <el-button 
                v-else 
                type="success" 
                :loading="returnLoading"
                @click="returnBook"
              >
                Return Book
              </el-button>
              
              <p v-if="!book.available && !hasBorrowed" class="unavailable-message">
                This book is currently unavailable. Please check back later.
              </p>
            </div>
            
            <div class="login-prompt" v-if="!isAuthenticated">
              <p>Please <el-link type="primary" @click="router.push('/login')">login</el-link> to borrow this book.</p>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.book-detail-container {
  width: 100%;
}

.book-detail {
  display: flex;
  gap: 32px;
}

.book-image-container {
  flex: 0 0 300px;
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-info {
  flex: 1;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.book-header h1 {
  font-size: 2rem;
  color: #303133;
  margin: 0;
}

.book-author {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 16px;
}

.book-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.book-meta {
  margin-bottom: 24px;
}

.book-meta p {
  margin: 8px 0;
  color: #606266;
}

.book-description h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #303133;
}

.book-description p {
  color: #606266;
  line-height: 1.6;
}

.borrow-section {
  margin-top: 32px;
}

.unavailable-message {
  margin-top: 8px;
  color: #f56c6c;
}

.login-prompt {
  margin-top: 32px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.book-detail-skeleton {
  display: flex;
  gap: 32px;
}

.book-image-skeleton {
  flex: 0 0 300px;
  height: 450px;
}

.book-info-skeleton {
  flex: 1;
}

@media (max-width: 768px) {
  .book-detail {
    flex-direction: column;
  }
  
  .book-image-container {
    flex: 0 0 auto;
    margin-bottom: 24px;
  }
  
  .book-header {
    flex-direction: column;
  }
  
  .book-actions {
    margin-top: 16px;
  }
  
  .book-detail-skeleton {
    flex-direction: column;
  }
  
  .book-image-skeleton {
    flex: 0 0 auto;
    height: 300px;
    margin-bottom: 24px;
  }
}
</style>