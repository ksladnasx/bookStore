<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../stores/theme'

const bookStore = useBookStore()
const authStore = useAuthStore()
const loading = ref(true)

const currentUser = computed(() => authStore.currentUser)

const borrowedBooks = computed(() => {
  if (!currentUser.value) return []

  const userBorrowings = bookStore.getUserBorrowings(currentUser.value.id)
  const activeBookIds = userBorrowings
    .filter(b => b.status === 'active' || b.status === 'overdue')
    .map(b => b.bookId)

  return bookStore.books.filter(book => activeBookIds.includes(book.id))
})

const borrowingHistory = computed(() => {
  if (!currentUser.value) return []

  const userBorrowings = bookStore.getUserBorrowings(currentUser.value.id)
  return userBorrowings.map(borrowing => {
    const book = bookStore.getBookById(borrowing.bookId)
    return {
      ...borrowing,
      bookTitle: book?.title || 'Unknown Book',
      bookAuthor: book?.author || 'Unknown Author',
      bookCover: book?.coverImage || ''
    }
  })
})

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false
  }, 800)
})

function returnBook(bookId: number) {
  bookStore.returnBook(bookId)
}
const theme = useTheme();
const isDark = computed(() => theme.isdark);

</script>

<template>
  <div class="my-books-container">
    <h1 :class="{ 'dark-mode': isDark }"> {{ $t('app.mybook.title') }}</h1>
    <p :class="{ 'dark-mode': isDark }">Manage your borrowed books and view your borrowing history</p>

    <el-tabs>
      <el-tab-pane label="Currently Borrowed">
        <el-skeleton v-if="loading" :rows="3" animated />

        <template v-else>
          <div v-if="borrowedBooks.length > 0">
            <el-table :data="borrowedBooks" style="width: 100%">
              <el-table-column label="Cover" width="100">
                <template #default="{ row }">
                  <img :src="row.coverImage" class="book-cover" />
                </template>
              </el-table-column>

              <el-table-column prop="title" label="Title" />

              <el-table-column prop="author" label="Author" />

              <el-table-column label="Actions" width="120">
                <template #default="{ row }">
                  <el-button type="primary" size="small" @click="returnBook(row.id)">
                    Return
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-empty v-else description="You don't have any books borrowed at the moment" />
        </template>
      </el-tab-pane>

      <el-tab-pane label="Borrowing History">
        <el-skeleton v-if="loading" :rows="3" animated />

        <template v-else>
          <div v-if="borrowingHistory.length > 0">
            <el-table :data="borrowingHistory" style="width: 100%">
              <el-table-column label="Cover" width="100">
                <template #default="{ row }">
                  <img :src="row.bookCover" class="book-cover" />
                </template>
              </el-table-column>

              <el-table-column prop="bookTitle" label="Title" />

              <el-table-column prop="bookAuthor" label="Author" />

              <el-table-column prop="borrowDate" label="Borrow Date" />

              <el-table-column prop="returnDate" label="Return Date">
                <template #default="{ row }">
                  {{ row.returnDate || 'Not returned' }}
                </template>
              </el-table-column>

              <el-table-column label="Status" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'primary' :
                    row.status === 'returned' ? 'success' : 'danger'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-empty v-else description="You don't have any borrowing history yet" />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.my-books-container {
  width: 100%;
}

.dark-mode {
  color: #e0e0e0 !important;
}

.my-books-container h1 {
  font-size: 2rem;
  color: #303133;
  margin-bottom: 8px;
}

.my-books-container>p {
  color: #606266;
  margin-bottom: 24px;
}

.book-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.el-tabs {
  margin-top: 24px;
}
</style>