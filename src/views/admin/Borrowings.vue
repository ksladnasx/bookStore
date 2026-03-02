<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookStore } from '../../stores/books'
import { fetchUsers } from '../../api/users'
import { returnBorrowing } from '../../api/borrowings'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { User } from '../../types'

const bookStore = useBookStore()
const { t } = useI18n()
const statusFilter = ref('')
const searchQuery = ref('')
const loading = ref(false)
const usersList = ref<(Omit<User, 'password'> & { password: '' })[]>([])

onMounted(async () => {
  loading.value = true
  try {
    await bookStore.fetchBorrowings()
    usersList.value = await fetchUsers()
  } finally {
    loading.value = false
  }
})

const allBorrowings = computed(() => {
  return bookStore.borrowings.map(borrowing => {
    const user = usersList.value.find(u => u.id === borrowing.userId)
    const book = bookStore.getBookById(borrowing.bookId)
    return {
      ...borrowing,
      userName: user?.name || t('admin.user'),
      bookTitle: book?.title || t('admin.book'),
      bookAuthor: book?.author || t('admin.author')
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

async function markAsReturned(borrowingId: number) {
  const borrowing = bookStore.borrowings.find(b => b.id === borrowingId)
  if (!borrowing || (borrowing.status !== 'active' && borrowing.status !== 'overdue')) return
  loading.value = true
  try {
    await returnBorrowing(borrowingId)
    await bookStore.fetchBooks()
    await bookStore.fetchBorrowings()
    ElMessage.success(t('admin.returnSuccess'))
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : t('register.confirm_error'))
  } finally {
    loading.value = false
  }
}

function confirmReturn(borrowingId: number) {
  ElMessageBox.confirm(
    t('admin.confirmReturnMessage'),
    t('admin.confirmReturnTitle'),
    {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning'
    }
  )
    .then(() => markAsReturned(borrowingId))
    .catch(() => {})
}

function resetFilters() {
  statusFilter.value = ''
  searchQuery.value = ''
}
</script>

<template>
  <div class="admin-borrowings">
    <div class="admin-borrowings-header">
      <h2>{{ t('admin.manageBorrowingsTitle') }}</h2>
    </div>
    
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        :placeholder="t('admin.searchByUserOrBook')"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        :placeholder="t('admin.filterByStatus')"
        clearable
        class="status-filter"
      >
        <el-option :label="t('admin.active')" value="active" />
        <el-option :label="t('admin.returned')" value="returned" />
        <el-option :label="t('admin.overdue')" value="overdue" />
      </el-select>

      <el-button @click="resetFilters" plain>{{ t('admin.resetFilters') }}</el-button>
    </div>
    
    <el-table 
      :data="filteredBorrowings" 
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column prop="userName" :label="t('admin.user')" min-width="150" sortable />
      
      <el-table-column prop="bookTitle" :label="t('admin.bookTitle')" min-width="200" sortable />
      
      <el-table-column prop="bookAuthor" :label="t('admin.author')" min-width="150" />
      
      <el-table-column prop="borrowDate" :label="t('admin.borrowDate')" width="120" sortable />
      
      <el-table-column prop="returnDate" :label="t('admin.returnDate')" width="120">
        <template #default="{ row }">
          {{ row.returnDate || t('admin.notReturned') }}
        </template>
      </el-table-column>
      
      <el-table-column :label="t('admin.status')" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.status === 'active' ? 'primary' : 
                   row.status === 'returned' ? 'success' : 'danger'"
          >
            {{ row.status === 'active' ? t('admin.active') : row.status === 'returned' ? t('admin.returned') : t('admin.overdue') }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('admin.actions')" width="120" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            plain
            @click="confirmReturn(row.id)"
            :disabled="row.status !== 'active' && row.status !== 'overdue'"
          >
            {{ t('admin.markAsReturned') }}
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