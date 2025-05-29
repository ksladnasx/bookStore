<script setup lang="ts">
import { ref, computed } from 'vue'
import users from '../../mockData/users'
import { useBookStore } from '../../stores/books'

const bookStore = useBookStore()
const searchQuery = ref('')
const loading = ref(false)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.filter(user => user.role === 'user')
  
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => 
    user.role === 'user' && (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  )
})

function getUserBorrowedBooks(userId: number) {
  return bookStore.books
    .filter(book => book.borrowedBy.includes(userId))
    .map(book => book.title)
    .join(', ')
}

function getBorrowingCount(userId: number) {
  return bookStore.books.filter(book => book.borrowedBy.includes(userId)).length
}
</script>

<template>
  <div class="admin-users">
    <div class="admin-users-header">
      <h2>Manage Users</h2>
    </div>
    
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search users by name, username or email"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <el-table 
      :data="filteredUsers" 
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column label="ID" prop="id" width="80" />
      
      <el-table-column prop="name" label="Name" min-width="150" sortable />
      
      <el-table-column prop="username" label="Username" min-width="120" sortable />
      
      <el-table-column prop="email" label="Email" min-width="180" />
      
      <el-table-column label="Borrowed Books" min-width="200">
        <template #default="{ row }">
          <span v-if="getBorrowingCount(row.id) > 0">
            {{ getUserBorrowedBooks(row.id) }}
          </span>
          <span v-else class="no-books">No books currently borrowed</span>
        </template>
      </el-table-column>
      
      <el-table-column label="Borrowing Count" width="150" sortable>
        <template #default="{ row }">
          <el-tag 
            :type="getBorrowingCount(row.id) > 0 ? 'primary' : 'info'"
          >
            {{ getBorrowingCount(row.id) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredUsers.length"
        :default-page-size="10"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-users {
  width: 100%;
}

.admin-users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-users-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.filter-section {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.no-books {
  color: #909399;
  font-style: italic;
}
</style>