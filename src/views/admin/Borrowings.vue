<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookStore } from '../../stores/books'
import users from '../../mockData/users'
import { ElMessageBox, ElMessage } from 'element-plus'

const bookStore = useBookStore()
const statusFilter = ref('')
const searchQuery = ref('')
const loading = ref(false)

const allBorrowings = computed(() => {
  return bookStore.borrowings.map(borrowing => {
    const user = users.find(u => u.id === borrowing.userId)
    const book = bookStore.getBookById(borrowing.bookId)
    
    return {
      ...borrowing,
      userName: user?.name || 'Unknown User',
      bookTitle: book?.title || 'Unknown Book',
      bookAuthor: book?.author || 'Unknown Author'
    }
  })
})

const filteredBorrowings = computed(() => {
  let result = allBorrowings.value
  
  if (statusFilter.value) {
    result = result.filter(b => b.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => 
      b.userName.toLowerCase().includes(query) ||
      b.bookTitle.toLowerCase().includes(query) ||
      b.bookAuthor.toLowerCase().includes(query)
    )
  }
  
  return result
})

function markAsReturned(borrowingId: number) {
  const borrowing = bookStore.borrowings.find(b => b.id === borrowingId)
  
  if (borrowing && borrowing.status === 'active') {
    // Find the book
    const book = bookStore.getBookById(borrowing.bookId)
    
    if (book) {
      // Remove user from borrowedBy array
      const index = book.borrowedBy.indexOf(borrowing.userId)
      if (index !== -1) {
        // Update book status
        bookStore.updateBook(book.id, {
          borrowedBy: book.borrowedBy.filter(id => id !== borrowing.userId),
          available: true
        })
        
        // Update borrowing record
        const borrowingIndex = bookStore.borrowings.findIndex(b => b.id === borrowingId)
        if (borrowingIndex !== -1) {
          bookStore.borrowings[borrowingIndex].returnDate = new Date().toISOString().split('T')[0]
          bookStore.borrowings[borrowingIndex].status = 'returned'
          
          ElMessage.success('Book marked as returned successfully')
        }
      }
    }
  }
}

function confirmReturn(borrowingId: number) {
  ElMessageBox.confirm(
    'Are you sure you want to mark this book as returned?',
    'Confirm Return',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      markAsReturned(borrowingId)
    })
    .catch(() => {
      // User cancelled
    })
}

function resetFilters() {
  statusFilter.value = ''
  searchQuery.value = ''
}
</script>

<template>
  <div class="admin-borrowings">
    <div class="admin-borrowings-header">
      <h2>Manage Borrowings</h2>
    </div>
    
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search by user or book"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        placeholder="Filter by status"
        clearable
        class="status-filter"
      >
        <el-option label="Active" value="active" />
        <el-option label="Returned" value="returned" />
        <el-option label="Overdue" value="overdue" />
      </el-select>

      <el-button @click="resetFilters" plain>Reset Filters</el-button>
    </div>
    
    <el-table 
      :data="filteredBorrowings" 
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column prop="userName" label="User" min-width="150" sortable />
      
      <el-table-column prop="bookTitle" label="Book Title" min-width="200" sortable />
      
      <el-table-column prop="bookAuthor" label="Author" min-width="150" />
      
      <el-table-column prop="borrowDate" label="Borrow Date" width="120" sortable />
      
      <el-table-column prop="returnDate" label="Return Date" width="120">
        <template #default="{ row }">
          {{ row.returnDate || 'Not returned' }}
        </template>
      </el-table-column>
      
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.status === 'active' ? 'primary' : 
                   row.status === 'returned' ? 'success' : 'danger'"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            plain
            @click="confirmReturn(row.id)"
            :disabled="row.status !== 'active' && row.status !== 'overdue'"
          >
            Mark as Returned
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredBorrowings.length"
        :default-page-size="10"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-borrowings {
  width: 100%;
}

.admin-borrowings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-borrowings-header h2 {
  margin: 0;
  font-size: 1.5rem;
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

.status-filter {
  width: 200px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .search-input, .status-filter {
    width: 100%;
  }
}
</style>