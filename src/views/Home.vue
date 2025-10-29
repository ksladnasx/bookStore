<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/books'
import BookCard from '../components/BookCard.vue'

const bookStore = useBookStore()
const router = useRouter()

const recentBooks = computed(() => {
  return bookStore.books.slice(0, 4)
})
import { useTheme } from '../stores/theme';

const theme = useTheme();
const isDark = computed(() => theme.isdark);
</script>

<template>
  <div class="home-container" :class="{ 'dark-mode': isDark }">
    <div class="hero-section">
      <h1>{{ $t('app.title') }}</h1>
      <p>{{ $t('app.describtion') }}</p>
      <el-button type="primary" size="large" @click="router.push('/books')">
        {{ $t('jie-shu') }} <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <div class="features-section">
      <h2>{{ $t('app.storefeature.title') }}</h2>
      <div class="features-grid">
        <div class="feature-item">
          <el-icon><Document /></el-icon>
          <h3>{{ $t('app.storefeature.item.title') }}</h3>
          <p>{{ $t('app.storefeature.item.description') }}</p>
        </div>
        <div class="feature-item">
          <el-icon><Reading /></el-icon>
          <h3>{{ $t('app.storefeature.item2.title') }}</h3>
          <p>{{ $t('app.storefeature.item2.description') }}</p>
        </div>
        <div class="feature-item">
          <el-icon><User /></el-icon>
          <h3>{{ $t('app.storefeature.item3.title') }}</h3>
          <p>{{ $t('app.storefeature.item3.description') }}</p>
        </div>
        <div class="feature-item">
          <el-icon><Search /></el-icon>
          <h3>{{ $t('app.storefeature.item4.title') }}</h3>
          <p>{{ $t('app.storefeature.item4.description') }}</p>
        </div>
      </div>
    </div>

    <div class="recent-books">
      <div class="section-header">
        <h2>{{ $t('app.recent.title') }}</h2>
        <el-button link @click="router.push('/books')">
         {{ $t('app.recent.all') }} <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="book-grid">
        <div v-for="book in recentBooks" :key="book.id" class="book-item">
          <BookCard :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  transition: background 0.3s, color 0.3s;
}

/* 黑暗模式下整体背景和字体色 */
.home-container.dark-mode {
  background-color: rgb(18, 18, 18);
  color: #e0e0e0;
}

.hero-section {
  text-align: center;
  padding: 48px 16px;
  background: linear-gradient(to right, #f0f2f5, #e6f7ff);
  border-radius: 8px;
  margin-bottom: 40px;
  transition: background 0.3s, color 0.3s;
}
.home-container.dark-mode .hero-section {
  background: linear-gradient(to right, #23272f, #222c36);
}
.hero-section h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 16px;
  transition: color 0.3s;
}
/* 当某个元素同时拥有 home-container 和 dark-mode 这两个类时，应用该选择器下定义的样式。 */
.home-container.dark-mode .hero-section h1 {
  color: #fff;
}
.hero-section p {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s;
}
.home-container.dark-mode .hero-section p {
  color: #b0b0b0;
}

/* 功能区 */
.features-section {
  padding: 40px 0;
}
.features-section h2 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 1.8rem;
  color: #303133;
  transition: color 0.3s;
}
.home-container.dark-mode .features-section h2 {
  color: #fff;
}

/* 让四个子项居中显示 */
.features-grid {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  flex-wrap: wrap;
}

.feature-item {
  flex: 0 1 280px;
  max-width: 320px;
  min-width: 220px;
  padding: 24px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: 
    background 0.3s, 
    color 0.3s, 
    box-shadow 0.3s, 
    transform 0.3s,
    opacity 0.4s;
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) forwards;
}
.features-grid .feature-item:nth-child(1) { animation-delay: 0.05s; }
.features-grid .feature-item:nth-child(2) { animation-delay: 0.15s; }
.features-grid .feature-item:nth-child(3) { animation-delay: 0.25s; }
.features-grid .feature-item:nth-child(4) { animation-delay: 0.35s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.feature-item:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 8px 24px 0 rgba(64,158,255,0.18);
  background: linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%);
}

.home-container.dark-mode .feature-item {
  background-color: #223355;
  color: #e0e0e0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.4);
}
.home-container.dark-mode .feature-item:hover {
  background: linear-gradient(135deg, #223355 60%, #1a2333 100%);
  box-shadow: 0 8px 24px 0 rgba(64,158,255,0.08);
}
.feature-item .el-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 16px;
  transition: color 0.3s;
}
.home-container.dark-mode .feature-item .el-icon {
  color: #90caf9;
}
.feature-item h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #303133;
  transition: color 0.3s;
}
.home-container.dark-mode .feature-item h3 {
  color: #fff;
}
.feature-item p {
  color: #606266;
  font-size: 0.95rem;
  transition: color 0.3s;
}
.home-container.dark-mode .feature-item p {
  color: #b0b0b0;
}

/* 最近图书区 */
.recent-books {
  margin-top: 40px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.section-header h2 {
  font-size: 1.8rem;
  color: #303133;
  margin: 0;
  transition: color 0.3s;
}
.home-container.dark-mode .section-header h2 {
  color: #fff;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}
.book-item {
  display: flex;
  flex-direction: column;
}

/* 响应式 */
@media (max-width: 1024px) {
  .features-grid {
    gap: 16px;
  }
  .feature-item {
    flex: 0 1 45%;
    min-width: 180px;
  }
}
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  .hero-section p {
    font-size: 1rem;
  }
  .features-grid {
    flex-direction: column;
    align-items: center;
  }
  .feature-item {
    width: 90%;
    min-width: 140px;
    margin-bottom: 16px;
  }
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>