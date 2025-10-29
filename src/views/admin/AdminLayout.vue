<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../../stores/theme'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const theme = useTheme()
const isDark = computed(() => theme.isdark)

const handleSelect = (key: string) => {
  router.push(key)
}
</script>

<template>
  <div class="admin-layout" :class="{ 'dark-mode': isDark }">
    <el-container class="elcontent">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '80px' : '200px'" class="sidebar" :class="{ 'dark-mode': isDark }">
        <div class="sidebar-header">
          <h3 v-if="!isCollapse">Admin Panel</h3>
          <el-icon v-else>
            <!-- 未展开就显示图标 -->
            <Monitor />
          </el-icon>
          <el-button link @click="isCollapse = !isCollapse" class="collapse-btn" >
            <el-icon>
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
        </div>
        <el-menu
          :default-active="route.path"
          class="el-menu-vertical"
          :collapse="isCollapse"
          @select="handleSelect"
          :class="{ 'dark-mode': isDark }"
        >
          <el-menu-item index="/admin">
            <el-icon><DataBoard /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item>
          <el-menu-item index="/admin/books">
            <el-icon><Document /></el-icon>
            <template #title>Books</template>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <template #title>Users</template>
          </el-menu-item>
          <el-menu-item index="/admin/borrowings">
            <el-icon><Reading /></el-icon>
            <template #title>Borrowings</template>
          </el-menu-item>
        </el-menu>

        <!-- 底部逻辑 -->
        <div class="sidebar-footer" :class="{ 'collapsed': isCollapse }">
          <el-button link @click="router.push('/')">
            <el-icon><HomeFilled /></el-icon>
            <span v-if="!isCollapse">Back to Site</span>
          </el-button>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部栏 -->
        <el-header class="admin-header" :class="{ 'dark-mode': isDark }">
          <div class="admin-title">Admin Panel</div>
          <div class="admin-user">
            <!-- 可放置用户信息/主题切换等 -->
            <span>Welcome, Admin</span>
            <!-- 你可以在这里插入 ThemeSwitcher 或头像等组件 -->
          </div>
        </el-header>
        <el-main class="admin-main" :class="{ 'dark-mode': isDark }">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.elcontent {
  height: 100vh;
  min-height: 100vh;
  display: flex;
}
.admin-layout {
  min-height: 100vh;
  width: 100%;
  background: #f5f7fa;
  transition: background 0.3s, color 0.3s;
}
.admin-layout.dark-mode {
  background: #181818;
  color: #e0e0e0;
}

.sidebar {
  background-color: #304156;
  color: #fff;
  transition: width 0.3s, background 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
    height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}
.sidebar.dark-mode {
  background-color: #23272f;
  color: #e0e0e0;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #1f2d3d;
}
.sidebar-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  letter-spacing: 1px;
}
.sidebar-header .el-icon {
  font-size: 24px;
  color: #90caf9;
}
.collapse-btn {
  color: #fff;
  margin-left: 0px;
}

.el-menu-vertical {
  border-right: none;
  background-color: inherit;
  transition: background 0.3s, color 0.3s;
}
.el-menu-vertical.dark-mode {
  background-color: #23272f;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
  padding-left: 30px;
  border-top: 1px solid #1f2d3d;
  display: flex;
  justify-content: start;
  align-items: start;
}
.sidebar-footer.collapsed {
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  min-height: 56px;
  transition: background 0.3s, color 0.3s;
}
.admin-header.dark-mode {
  background-color: #23272f;
  color: #e0e0e0;
  border-bottom: 1px solid #23272f;
}
.admin-title {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}
.admin-user {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}
.admin-main {
  padding: 32px 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 56px);
  transition: background 0.3s, color 0.3s;
}
.admin-main.dark-mode {
  background: #181818;
  color: #e0e0e0;
}

/* 菜单高亮和悬浮 */
:deep(.el-menu-item.is-active) {
  background-color: #1f2d3d !important;
  color: #409EFF !important;
}
:deep(.el-menu-item) {
  color: #bfcbd9;
  transition: color 0.3s;
}
:deep(.el-menu-item:hover) {
  background-color: #223355 !important;
  color: #90caf9 !important;
}
:deep(.el-menu-item.is-active) {
  color: #409EFF !important;
}

/* 响应式 */
@media (max-width: 900px) {
  .admin-main {
    padding: 16px 8px;
  }
  .admin-header {
    padding: 0 8px;
  }
  .sidebar-header {
    padding: 0 8px;
  }
}
</style>