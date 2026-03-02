<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchUsers } from '../../api/users'
import { updateUserProfile } from '../../api/auth'
import { useBookStore } from '../../stores/books'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { User } from '../../types'

const bookStore = useBookStore()
const { t } = useI18n()
const searchQuery = ref('')
const loading = ref(false)
const usersList = ref<(Omit<User, 'password'> & { password: '' })[]>([])

const editDialogVisible = ref(false)
const editLoading = ref(false)
const editingUser = ref<null | (Omit<User, 'password'> & { password: '' })>(null)
const editForm = ref({ name: '', email: '', password: '' })

function openEdit(row: Omit<User, 'password'> & { password: '' }) {
  editingUser.value = row
  editForm.value = { name: row.name, email: row.email, password: '' }
  editDialogVisible.value = true
}

async function submitEdit() {
  if (!editingUser.value) return
  editLoading.value = true
  try {
    const payload: { name?: string; email?: string; password?: string } = {
      name: editForm.value.name.trim(),
      email: editForm.value.email.trim()
    }
    if (editForm.value.password) payload.password = editForm.value.password
    await updateUserProfile(editingUser.value.id, payload)
    ElMessage.success(t('admin.editUserSuccess'))
    editDialogVisible.value = false
    usersList.value = await fetchUsers()
  } catch (e: unknown) {
    ElMessage.error((e as { message?: string })?.message || t('admin.editUserError'))
  } finally {
    editLoading.value = false
  }
}

function closeEdit() {
  editingUser.value = null
  editForm.value = { name: '', email: '', password: '' }
  editDialogVisible.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    usersList.value = await fetchUsers()
  } finally {
    loading.value = false
  }
})

const filteredUsers = computed(() => {
  const list = usersList.value.filter(user => user.role === 'user')
  if (!searchQuery.value) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
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
      <h2>{{ t('admin.manageUsersTitle') }}</h2>
    </div>
    
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        :placeholder="t('admin.searchUsersPlaceholder')"
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
      <el-table-column :label="t('admin.id')" prop="id" width="80" />
      
      <el-table-column prop="name" :label="t('admin.name')" min-width="150" sortable />
      
      <el-table-column prop="username" :label="t('admin.username')" min-width="120" sortable />
      
      <el-table-column prop="email" :label="t('admin.email')" min-width="180" />
      
      <el-table-column :label="t('admin.borrowedBooksList')" min-width="200">
        <template #default="{ row }">
          <span v-if="getBorrowingCount(row.id) > 0">
            {{ getUserBorrowedBooks(row.id) }}
          </span>
          <span v-else class="no-books">{{ t('admin.noBooksBorrowed') }}</span>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('admin.borrowingCount')" width="150" sortable>
        <template #default="{ row }">
          <el-tag 
            :type="getBorrowingCount(row.id) > 0 ? 'primary' : 'info'"
          >
            {{ getBorrowingCount(row.id) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="t('admin.actions')" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openEdit(row)">
            {{ t('admin.editUser') }}
          </el-button>
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

    <el-dialog
      v-model="editDialogVisible"
      :title="t('admin.editUserTitle')"
      width="420px"
      destroy-on-close
      @close="closeEdit"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item :label="t('admin.name')">
          <el-input v-model="editForm.name" :placeholder="t('admin.name')" />
        </el-form-item>
        <el-form-item :label="t('admin.email')">
          <el-input v-model="editForm.email" type="email" :placeholder="t('admin.email')" />
        </el-form-item>
        <el-form-item :label="t('admin.password')">
          <el-input
            v-model="editForm.password"
            type="password"
            :placeholder="t('admin.passwordPlaceholder')"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeEdit">{{ t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">
          {{ t('admin.saveUser') }}
        </el-button>
      </template>
    </el-dialog>
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