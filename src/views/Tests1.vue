<template>
  <div class="my-devices-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">我的常用设备</h1>
    </div>

    <!-- 设备列表 -->
    <div class="devices-container">
      <div 
        v-for="device in deviceList" 
        :key="device.id" 
        class="device-card"
      >
        <div class="device-header">
          <span class="device-name">{{ device.name }}</span>
          <div class="device-uuid">{{ device.uuid }}</div>
          <el-button 
            class="delete-btn" 
            type="danger" 
            circle 
            :icon="Minus" 
            @click="handleDeleteDevice(device)"
          />
        </div>
        
        
        
        <div class="device-info">
          <div class="info-item">
            <span class="info-label">最近登录时间:</span>
            <span class="info-value">{{ device.lastLoginTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">绑定时间:</span>
            <span class="info-value">{{ device.bindTime }}</span>
          </div>
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <div v-if="deviceList.length === 0" class="empty-state">
        <el-empty description="暂无设备" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Minus } from '@element-plus/icons-vue'

// 模拟设备数据
const deviceList = ref([
  {
    id: 1,
    name: '设备一',
    uuid: 'E74CB252D9F8601A13B267CFEF29837E',
    lastLoginTime: '2025-12-12 12:12:12',
    bindTime: '2025-12-12 12:12:12'
  },
  {
    id: 2,
    name: '设备二',
    uuid: 'E74CB252D9F8601A13B267CFEF29837E',
    lastLoginTime: '2025-12-12 12:12:12',
    bindTime: '2025-12-12 12:12:12'
  }
])

// 模拟获取设备列表的API
const fetchDeviceList = async () => {
  // 模拟API调用延迟
  return new Promise(resolve => {
    setTimeout(() => {
      // 在实际项目中，这里应该是真实的API调用
      // const response = await api.get('/api/devices')
      // deviceList.value = response.data
      
      // 这里我们使用假数据
      console.log('获取设备列表成功')
      resolve()
    }, 500)
  })
}

// 模拟删除设备的API
const deleteDevice = async (deviceId) => {
  // 模拟API调用延迟
  return new Promise(resolve => {
    setTimeout(() => {
      // 在实际项目中，这里应该是真实的API调用
      // await api.delete(`/api/devices/${deviceId}`)
      
      console.log(`删除设备 ${deviceId} 成功`)
      resolve()
    }, 500)
  })
}

// 删除设备处理函数
const handleDeleteDevice = (device) => {
  ElMessageBox.confirm(
    `确定要删除设备 "${device.name}" 吗？此操作不可撤销。`,
    '删除设备',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  )
    .then(async () => {
      try {
        // 调用删除API
        await deleteDevice(device.id)
        
        // 从列表中移除设备
        deviceList.value = deviceList.value.filter(d => d.id !== device.id)
        
        ElMessage.success('设备删除成功')
      } catch (error) {
        console.error('删除设备失败:', error)
        ElMessage.error('设备删除失败，请重试')
      }
    })
    .catch(() => {
      // 用户取消操作
      ElMessage.info('已取消删除')
    })
}

// 组件挂载时获取设备列表
onMounted(() => {
  fetchDeviceList()
})
</script>

<style scoped>
.my-devices-page {
  padding: 20px;
  /* background-color: #f5f7fa; */
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.devices-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.device-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  position: relative;
}

.device-header {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 15px;
}

.device-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-uuid {
  background-color: #f5f7fa;
  color: #606266;
  padding: 10px 15px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  /* margin-bottom: 15px; */
  min-width: 50%;
  word-break: break-all;
}

.device-info {
  display: flex;
  flex-direction:row;
  justify-content: space-evenly;
}

.info-item {
  
  display: flex;
  align-items: center;
}

.info-label {
  color: #606266;
  font-size: 12px;
  min-width: 120px;
}

.info-value {
  color: #303133;
  font-size: 12px;
}

.empty-state {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .my-devices-page {
    padding: 15px;
  }
  
  .device-card {
    padding: 15px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    min-width: auto;
  }
}
</style>