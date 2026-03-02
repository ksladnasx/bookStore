<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookStore } from '../../stores/books'
import { useRouter } from 'vue-router'
import { fetchUsers } from '../../api/users'
import { useI18n } from 'vue-i18n'
import type { User } from '../../types'

const bookStore = useBookStore()
const router = useRouter()
const { t } = useI18n()
const usersList = ref<(Omit<User, 'password'> & { password: '' })[]>([])

onMounted(async () => {
  usersList.value = await fetchUsers()
  await bookStore.fetchBorrowings()
})

const totalBooks = computed(() => bookStore.books.length)
const availableBooks = computed(() => bookStore.books.filter(book => book.available).length)
const borrowedBooks = computed(() => totalBooks.value - availableBooks.value)
const totalUsers = computed(() => usersList.value.filter(user => user.role === 'user').length)

const booksByCategory = computed(() => {
  const categories: Record<string, number> = {}
  bookStore.books.forEach(book => {
    if (categories[book.category]) {
      categories[book.category]++
    } else {
      categories[book.category] = 1
    }
  })
  return Object.entries(categories).map(([name, value]) => ({ name, value }))
})

const recentBorrowings = computed(() => {
  return bookStore.borrowings
    .filter(borrowing => borrowing.status === 'active')
    .slice(0, 5)
    .map(borrowing => {
      const book = bookStore.getBookById(borrowing.bookId)
      const user = usersList.value.find(u => u.id === borrowing.userId)
      return {
        id: borrowing.id,
        bookTitle: book?.title || t('admin.book'),
        userName: user?.name || t('admin.user'),
        borrowDate: borrowing.borrowDate
      }
    })
})

const bookBorrowRanking = computed(() => {
  return [...bookStore.books]
    .map(b => ({ id: b.id, title: b.title, count: b.borrowedBy.length }))
    .filter(b => b.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})
</script>

<template>
  <!-- <h2>数据汇总</h2> -->
  <div class="dashboard">
    
    <div class="stats-cards">
      <el-card>
        <div class="stats-card">
          <div class="stats-icon books-icon">
            <el-icon>
              <Document />
            </el-icon>
          </div>
          <div class="stats-content">
            <h3>{{ t('admin.totalBooks') }}</h3>
            <div class="stats-value">{{ totalBooks }}</div>
            <el-link type="primary" @click="router.push('/admin/books')">{{ t('admin.viewAllBooks') }}</el-link>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="stats-card">
          <div class="stats-icon users-icon">
            <el-icon>
              <User />
            </el-icon>
          </div>
          <div class="stats-content">
            <h3>{{ t('admin.totalUsers') }}</h3>
            <div class="stats-value">{{ totalUsers }}</div>
            <el-link type="primary" @click="router.push('/admin/users')">{{ t('admin.viewAllUsers') }}</el-link>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="stats-card">
          <div class="stats-icon borrowed-icon">
            <el-icon>
              <Reading />
            </el-icon>
          </div>
          <div class="stats-content">
            <h3>{{ t('admin.borrowedBooks') }}</h3>
            <div class="stats-value">{{ borrowedBooks }}</div>
            <el-link type="primary" @click="router.push('/admin/borrowings')">{{ t('admin.viewBorrowings') }}</el-link>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="stats-card">
          <div class="stats-icon available-icon">
            <el-icon>
              <Checked />
            </el-icon>
          </div>
          <div class="stats-content">
            <h3>{{ t('admin.availableBooks') }}</h3>
            <div class="stats-value">{{ availableBooks }}</div>
            <div class="stats-percentage">{{ Math.round((availableBooks / totalBooks) * 100) }}% {{ t('admin.ofTotal') }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="dashboard-row">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <h3>{{ t('admin.booksByCategory') }}</h3>
          </div>
        </template>

        <el-table :data="booksByCategory" style="width: 100%">
          <el-table-column prop="name" :label="t('admin.category')" />
          <el-table-column prop="value" :label="t('admin.count')" width="100" />
          <el-table-column :label="t('admin.distribution')" min-width="180">
            <template #default="{ row }">
              <div class="chart-bar-container">
                <div class="chart-bar" :style="{ width: `${(row.value / totalBooks) * 100}%` }"></div>
                <span class="chart-percentage">{{ Math.round((row.value / totalBooks) * 100) }}%</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="dashboard-row-two">
        <el-card class="recent-borrowings-card">
          <template #header>
            <div class="card-header">
              <h3>{{ t('admin.recentBorrowings') }}</h3>
              <el-link type="primary" @click="router.push('/admin/borrowings')">{{ t('admin.all') }} ></el-link>
            </div>
          </template>

          <div v-if="recentBorrowings.length > 0">
            <el-table :data="recentBorrowings" style="width: 100%">
              <el-table-column prop="bookTitle" :label="t('admin.book')" />
              <el-table-column prop="userName" :label="t('admin.user')" />
              <el-table-column prop="borrowDate" :label="t('admin.date')" width="120" />
            </el-table>
          </div>

          <el-empty v-else :description="t('admin.noRecentBorrowings')" />
        </el-card>

        <el-card class="ranking-card">
          <template #header>
            <div class="card-header">
              <h3>{{ t('admin.borrowRankTitle') }}</h3>
            </div>
          </template>

          <div v-if="bookBorrowRanking.length > 0" class="ranking-list">
            <div
              v-for="(item, index) in bookBorrowRanking"
              :key="item.id"
              class="ranking-item"
            >
              <span class="ranking-index" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <span class="ranking-title">{{ item.title }}</span>
              <el-tag size="small" type="primary">{{ item.count }}</el-tag>
            </div>
          </div>
          <el-empty v-else :description="t('admin.noRecentBorrowings')" />
        </el-card>
      </div>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <h3>{{ t('admin.quickActions') }}</h3>
        </div>
      </template>

      <div class="quick-actions">
        <el-button type="primary" @click="router.push('/admin/books/add')">
          <el-icon>
            <Plus />
          </el-icon> {{ t('admin.addBook') }}
        </el-button>

        <el-button @click="router.push('/admin/borrowings')">
          <el-icon>
            <View />
          </el-icon> {{ t('admin.manageBorrowings') }}
        </el-button>

        <el-button @click="router.push('/admin/users')">
          <el-icon>
            <User />
          </el-icon> {{ t('admin.manageUsers') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.stats-card {
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  padding: 8px;
}

.stats-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stats-icon .el-icon {
  font-size: 32px;
  color: #fff;
}

.books-icon {
  background-color: #409EFF;
}

.users-icon {
  background-color: #67C23A;
}

.borrowed-icon {
  background-color: #E6A23C;
}

.available-icon {
  background-color: #909399;
}

.stats-content {
  flex: 1;
}

.stats-content h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stats-percentage {
  font-size: 12px;
  color: #909399;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.dashboard-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  height: 100%;
}

.recent-borrowings-card,
.ranking-card {
  min-height: 280px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-index {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
  background: #f0f0f0;
  color: #606266;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.ranking-index.top {
  background: #409eff;
  color: #fff;
}

.ranking-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.chart-bar-container {
  width: 100%;
  height: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background-color: #409EFF;
  border-radius: 4px;
}

.chart-percentage {
  position: absolute;
  right: 8px;
  top: 0;
  font-size: 12px;
  line-height: 16px;
  color: #303133;
}

.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }

  .dashboard-row-two {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>