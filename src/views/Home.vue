<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/books'
import BookCard from '../components/BookCard.vue'

const bookStore = useBookStore()
const router = useRouter()

const recentBooks = computed(() => {
  return bookStore.books.slice(0, 4)
})
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>Welcome to My Library</h1>
      <p>Discover, borrow, and enjoy thousands of books from our collection.</p>
      <el-button type="primary" size="large" @click="router.push('/books')">
        借书 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <div class="features-section">
      <h2>书店特色</h2>
      <div class="features-grid">
        <div class="feature-item">
          <el-icon><Document /></el-icon>
          <h3>Extensive Collection</h3>
          <p>Access thousands of books across various genres and topics.</p>
        </div>
        <div class="feature-item">
          <el-icon><Reading /></el-icon>
          <h3>Easy Borrowing</h3>
          <p>Borrow books with just a few clicks and manage your reading list.</p>
        </div>
        <div class="feature-item">
          <el-icon><User /></el-icon>
          <h3>Personal Account</h3>
          <p>Track your borrowing history and manage your returns.</p>
        </div>
        <div class="feature-item">
          <el-icon><Search /></el-icon>
          <h3>Quick Search</h3>
          <p>Find exactly what you're looking for with our powerful search.</p>
        </div>
      </div>
    </div>

    <div class="recent-books">
      <div class="section-header">
        <h2>最近添加</h2>
        <el-button type="text" @click="router.push('/books')">
         全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="book-grid">
        <div v-for="book in recentBooks" :key="book.id" class="book-item">
          <BookCard :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 48px 16px;
  background: linear-gradient(to right, #f0f2f5, #e6f7ff);
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 16px;
}

.hero-section p {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-section {
  padding: 40px 0;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 1.8rem;
  color: #303133;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.feature-item {
  padding: 24px;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.feature-item .el-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 16px;
}

.feature-item h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #303133;
}

.feature-item p {
  color: #606266;
  font-size: 0.95rem;
}

.recent-books {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #303133;
  margin: 0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.book-item {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>