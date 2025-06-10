<script setup lang="ts">
import { computed } from 'vue'
import { useBookStore } from '../../stores/books'
import { useRouter } from 'vue-router'
import users from '../../mockData/users'


const bookStore = useBookStore()
const router = useRouter()

const totalBooks = computed(() => bookStore.books.length)
const availableBooks = computed(() => bookStore.books.filter(book => book.available).length)
const borrowedBooks = computed(() => totalBooks.value - availableBooks.value)
const totalUsers = computed(() => users.filter(user => user.role === 'user').length)

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
      const user = users.find(u => u.id === borrowing.userId)

      return {
        id: borrowing.id,
        bookTitle: book?.title || 'Unknown Book',
        userName: user?.name || 'Unknown User',
        borrowDate: borrowing.borrowDate
      }
    })
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
            <h3>Total Books</h3>
            <div class="stats-value">{{ totalBooks }}</div>
            <el-link type="primary" @click="router.push('/admin/books')">View All Books</el-link>
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
            <h3>Total Users</h3>
            <div class="stats-value">{{ totalUsers }}</div>
            <el-link type="primary" @click="router.push('/admin/users')">View All Users</el-link>
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
            <h3>Borrowed Books</h3>
            <div class="stats-value">{{ borrowedBooks }}</div>
            <el-link type="primary" @click="router.push('/admin/borrowings')">View Borrowings</el-link>
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
            <h3>Available Books</h3>
            <div class="stats-value">{{ availableBooks }}</div>
            <div class="stats-percentage">{{ Math.round((availableBooks / totalBooks) * 100) }}% of total</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="dashboard-row">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <h3>书籍类型占比</h3>
          </div>
        </template>

        <el-table :data="booksByCategory" style="width: 100%">
          <el-table-column prop="name" label="Category" />
          <el-table-column prop="value" label="Count" width="100" />
          <el-table-column label="Distribution" min-width="180">
            <template #default="{ row }">
              <div class="chart-bar-container">
                <div class="chart-bar" :style="{ width: `${(row.value / totalBooks) * 100}%` }"></div>
                <span class="chart-percentage">{{ Math.round((row.value / totalBooks) * 100) }}%</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="recent-borrowings-card">
        <template #header>
          <div class="card-header">
            <h3>最近借阅</h3>
            <el-link type="primary" @click="router.push('/admin/borrowings')">全部 ></el-link>
          </div>
        </template>

        <div v-if="recentBorrowings.length > 0">
          <el-table :data="recentBorrowings" style="width: 100%">
            <el-table-column prop="bookTitle" label="Book" />
            <el-table-column prop="userName" label="User" />
            <el-table-column prop="borrowDate" label="Date" width="120" />
          </el-table>
        </div>

        <el-empty v-else description="No recent borrowings" />
      </el-card>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <h3>快捷操作</h3>
        </div>
      </template>

      <div class="quick-actions">
        <el-button type="primary" @click="router.push('/admin/books/add')">
          <el-icon>
            <Plus />
          </el-icon> 添加书籍
        </el-button>

        <el-button @click="router.push('/admin/borrowings')">
          <el-icon>
            <View />
          </el-icon> 管理书籍
        </el-button>

        <el-button @click="router.push('/admin/users')">
          <el-icon>
            <User />
          </el-icon> 用户管理
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card,
.recent-borrowings-card {
  height: 100%;
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

  .stats-cards {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>