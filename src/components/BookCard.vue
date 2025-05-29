<script setup lang="ts">
import { Book } from '../types'
import { useRouter } from 'vue-router'

defineProps<{
  book: Book
}>()

const router = useRouter()

function viewBookDetails(id: number) {
  router.push(`/books/${id}`)
}
</script>

<template>
  <el-card 
    :body-style="{ padding: '0px' }" 
    shadow="hover"
    class="book-card"
    @click="viewBookDetails(book.id)"
  >
    <img :src="book.coverImage" class="book-cover" />
    <div class="book-info">
      <div class="book-status">
        <el-tag 
          :type="book.available ? 'success' : 'danger'" 
          size="small"
        >
          {{ book.available ? 'Available' : 'Borrowed' }}
        </el-tag>
      </div>
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <div class="book-category">
        <el-tag size="small" type="info">{{ book.category }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.book-card {
  width: 100%;
  transition: transform 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.book-info {
  padding: 16px;
  position: relative;
}

.book-status {
  position: absolute;
  top: -12px;
  right: 16px;
}

.book-title {
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-category {
  margin-top: 8px;
}
</style>