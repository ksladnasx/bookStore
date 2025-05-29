<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="layout">
    <header>
      <NavBar />
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} Library Management System</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background-color: #f5f7fa;
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}
</style>