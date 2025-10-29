<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isCollapse = ref(false)

const handleSelect = (key: string) => {
  router.push(key)
}


</script>

<template>
  <div class="admin-layout">
    <el-container class="elcontent">
      <div style="height: 120vh;">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
          <div class="sidebar-header">
            <h3 v-if="!isCollapse">Admin Panel</h3>
            <el-icon v-else>
              <Monitor />
            </el-icon>
            <el-button link @click="isCollapse = !isCollapse" class="collapse-btn">
              <el-icon>
                <component :is="isCollapse ? 'Expand' : 'Fold'" />
              </el-icon>
            </el-button>
          </div>

          <el-menu :default-active="route.path" class="el-menu-vertical" :collapse="isCollapse" @select="handleSelect">
            <el-menu-item index="/admin">
              <el-icon>
                <DataBoard />
              </el-icon>
              <template #title>Dashboard</template>
            </el-menu-item>

            <el-menu-item index="/admin/books">
              <el-icon>
                <Document />
              </el-icon>
              <template #title>Books</template>
            </el-menu-item>

            <el-menu-item index="/admin/users">
              <el-icon>
                <User />
              </el-icon>
              <template #title>Users</template>
            </el-menu-item>

            <el-menu-item index="/admin/borrowings">
              <el-icon>
                <Reading />
              </el-icon>
              <template #title>Borrowings</template>
            </el-menu-item>
          </el-menu>

          <div class="sidebar-footer" :class="{ 'collapsed': isCollapse }">
            <el-button link @click="router.push('/')">
              <el-icon>
                <HomeFilled />
              </el-icon>
              <span v-if="!isCollapse">Back to Site</span>
            </el-button>
          </div>
        </el-aside>
      </div>

      <el-container>


        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: calc(100vh - 64px);
  width: 100%;
}

.sidebar {
  background-color: #304156;
  color: #fff;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

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
}

.collapse-btn {
  color: #fff;
}

.el-menu-vertical {
  border-right: none;
  background-color: #304156;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
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
  padding: 0 20px;
}

.admin-title {
  font-size: 18px;
  font-weight: bold;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-user span {
  font-size: 14px;
}

:deep(.el-menu-item.is-active) {
  background-color: #1f2d3d;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover) {
  background-color: #1f2d3d;
}

:deep(.el-menu-item.is-active) {
  color: #409EFF;
}
</style>