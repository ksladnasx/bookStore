<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookStore } from '../stores/books'
import BookCard from '../components/BookCard.vue'

const bookStore = useBookStore()
const loading = ref(true)

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false
  }, 800)
})

function resetFilters() {
  bookStore.searchQuery = ''
  bookStore.categoryFilter = ''
}
</script>

<template>
  <div class="books-container">
    <div class="books-header">
      <h1>Book Collection</h1>
      <p>Browse our extensive library collection</p>
    </div>

    <div class="filter-section">
      <el-input
        v-model="bookStore.searchQuery"
        placeholder="Search books by title, author or ISBN"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="bookStore.categoryFilter"
        placeholder="Filter by category"
        clearable
        class="category-filter"
      >
        <el-option
          v-for="category in bookStore.categories"
          :key="category"
          :label="category"
          :value="category"
        />
      </el-select>

      <el-button @click="resetFilters" plain>Reset Filters</el-button>
    </div>

    <el-divider />

    <el-skeleton 
      :loading="loading" 
      animated 
      :count="8"
      :throttle="500"
    >
      <template #template>
        <div class="book-grid">
          <div 
            v-for="i in 8" 
            :key="i" 
            class="book-skeleton"
          >
            <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="p" style="width: 50%" />
              <el-skeleton-item variant="text" style="margin-top: 16px; width: 80%" />
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <div v-if="bookStore.filteredBooks.length > 0" class="book-grid">
          <div 
            v-for="book in bookStore.filteredBooks" 
            :key="book.id"
            class="book-item"
          >
            <BookCard :book="book" />
          </div>
        </div>

        <el-empty 
          v-else 
          description="No books found matching your criteria" 
        />
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.books-container {
  width: 100%;
}

.books-header {
  margin-bottom: 24px;
}

.books-header h1 {
  font-size: 2rem;
  color: #303133;
  margin-bottom: 8px;
}

.books-header p {
  color: #606266;
  font-size: 1.1rem;
}

.filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.category-filter {
  width: 200px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.book-item, .book-skeleton {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .search-input, .category-filter {
    width: 100%;
  }

  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>