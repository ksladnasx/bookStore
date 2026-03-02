<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../../stores/books'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const bookStore = useBookStore()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
const categoryFilter = ref('')

const filteredBooks = computed(() => {
  let result = [...bookStore.books]
  
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

function addNewBook() {
  router.push('/admin/books/add')
}

function editBook(id: number) {
  router.push(`/admin/books/edit/${id}`)
}

function deleteBook(id: number) {
  ElMessageBox.confirm(
    t('admin.deleteBookConfirm'),
    t('admin.delete'),
    {
      confirmButtonText: t('admin.delete'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      bookStore.deleteBook(id)
      ElMessage.success(t('admin.deleteBookSuccess'))
    })
    .catch(() => {})
}

function viewBookDetails(id: number) {
  router.push(`/books/${id}`)
}

function resetFilters() {
  searchQuery.value = ''
  categoryFilter.value = ''
}
</script>

<template>
  <div class="admin-books">
    <div class="admin-books-header">
      <h2>{{ t('admin.manageBooksTitle') }}</h2>
      <el-button type="primary" @click="addNewBook">
        <el-icon><Plus /></el-icon> {{ t('admin.addNewBook') }}
      </el-button>
    </div>
    
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        :placeholder="t('admin.searchBooksPlaceholder')"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="categoryFilter"
        :placeholder="t('admin.filterByCategory')"
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

      <el-button @click="resetFilters" plain>{{ t('admin.resetFilters') }}</el-button>
    </div>
    
    <el-table 
      :data="filteredBooks" 
      style="width: 100%"
      border
      stripe
      v-loading="bookStore.loading"
    >
      <el-table-column :label="t('admin.cover')" width="80">
        <template #default="{ row }">
          <el-image 
            :src="row.coverImage" 
            :preview-src-list="[row.coverImage]"
            style="width: 50px; height: 70px; object-fit: cover"
          />
        </template>
      </el-table-column>
      
      <el-table-column prop="title" :label="t('admin.title')" min-width="180" sortable />
      
      <el-table-column prop="author" :label="t('admin.author')" min-width="150" sortable />
      
      <el-table-column prop="category" :label="t('admin.category')" width="120" sortable />
      
      <el-table-column prop="publishYear" :label="t('admin.year')" width="100" sortable />
      
      <el-table-column prop="isbn" label="ISBN" min-width="150" />
      
      <el-table-column :label="t('admin.status')" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.available ? 'success' : 'danger'" 
            effect="plain"
          >
            {{ row.available ? t('admin.available') : t('admin.borrowed') }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('admin.availability')" width="120">
        <template #default="{ row }">
          {{ row.quantity - row.borrowedBy.length }} / {{ row.quantity }}
        </template>
      </el-table-column>
      
      <el-table-column :label="t('admin.actions')" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="viewBookDetails(row.id)"
            >
              {{ t('admin.view') }}
            </el-button>
            
            <el-button 
              size="small" 
              type="primary"
              @click="editBook(row.id)"
            >
              {{ t('admin.edit') }}
            </el-button>
            
            <el-button 
              size="small" 
              type="danger" 
              :disabled="row.borrowedBy.length > 0"
              @click="deleteBook(row.id)"
            >
              {{ t('admin.delete') }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next, sizes"
        :total="filteredBooks.length"
        :page-sizes="[10, 20, 50, 100]"
        :default-page-size="10"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-books {
  width: 100%;
}

.admin-books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-books-header h2 {
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

.category-filter {
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

  .search-input, .category-filter {
    width: 100%;
  }
}
</style>