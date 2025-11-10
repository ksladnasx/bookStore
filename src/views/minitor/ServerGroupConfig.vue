<template>
  <div class="server-group-config">
    <div class="config-container">
      <!-- 第一行：选择已有后端服务器组 -->
      <div class="first-row">
        <span class="label-text">选择已有后端服务器组</span>
        <el-button type="primary" @click="handleSelectExistingGroup">
          选择后端服务器组
        </el-button>
      </div>

      <!-- 第二行：后端服务器组名称 -->
      <div class="second-row">
        <div class="form-item">
          <span class="form-label required">后端服务器组名称</span>
          <el-input 
            v-model="localServerGroupName"
            placeholder="请输入后端服务器组名称" 
            class="name-input"
            maxlength="32"
            show-word-limit
            @input="handleServerGroupNameChange"
          />
        </div>
      </div>

      <!-- 第三行：查询条件 -->
      <div class="third-row">
        <div class="search-form">
          <el-select v-model="searchParams.type" class="type-select">
            <el-option label="名称" value="name" />
            <el-option label="IP" value="ip" />
          </el-select>
          <el-input 
            v-model="searchParams.name" 
            placeholder="请输入名称" 
            class="search-input"
          />
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 第四行：穿梭框布局 -->
      <div class="transfer-layout">
        <!-- 左侧：可选服务器列表 -->
        <div class="transfer-panel left-panel">
          <div class="panel-header">
            <span>服务器列表</span>
            <span class="count-text">共{{ leftData.length }}条</span>
          </div>
          <div class="panel-content">
            <el-table
              :data="leftPagedData"
              style="width: 100%"
              @selection-change="handleLeftSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="name" label="服务器名称" min-width="180" />
              <el-table-column prop="type" label="服务器类型" width="120" />
              <el-table-column prop="ip" label="IP" min-width="250">
                <template #default="scope">
                  <div class="ip-display">
                    {{ scope.row.ip }}
                    <div class="ip-tags">
                      <span class="tag private">(私有)</span>
                      <span class="tag elastic">-(弹性)</span>
                      <span class="tag management">-(管理)</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="spec" label="计算规格" width="120" />
              <el-table-column prop="state" label="状态" width="100">
                <template #default="scope">
                  <el-tag type="success" size="small">{{ scope.row.state }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 左侧分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="leftCurrentPage"
                v-model:page-size="pageSize"
                :total="leftData.length"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </div>
        </div>

        <!-- 中间：穿梭按钮 -->
        <div class="transfer-controls">
          <el-button 
            type="primary" 
            :disabled="leftSelected.length === 0"
            @click="transferToRight"
            class="transfer-btn"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>

        <!-- 右侧：已选服务器组 -->
        <div class="transfer-panel right-panel">
          <div class="panel-header">
            <span>已选服务器组</span>
            <span class="count-text">共{{ rightData.length }}条</span>
          </div>
          <div class="panel-content">
            <el-table
              :data="rightPagedData"
              style="width: 100%"
            >
              <el-table-column prop="name" label="服务器名称" min-width="180" />
              <el-table-column prop="type" label="服务器类型" width="120" />
              <el-table-column prop="ip" label="IP" min-width="250">
                <template #default="scope">
                  <div class="ip-display">
                    {{ scope.row.ip }}
                    <div class="ip-tags">
                      <span class="tag private">(私有)</span>
                      <span class="tag elastic">-(弹性)</span>
                      <span class="tag management">-(管理)</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="spec" label="计算规格" width="120" />
              <el-table-column prop="state" label="状态" width="100">
                <template #default="scope">
                  <el-tag type="success" size="small">{{ scope.row.state }}</el-tag>
                </template>
              </el-table-column>
              <!-- 右侧特有列：端口 -->
              <el-table-column label="端口" width="100">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.port" 
                    :min="1" 
                    :max="65535" 
                    size="small"
                    controls-position="right"
                    class="port-input"
                  />
                </template>
              </el-table-column>
              <!-- 右侧特有列：权重 -->
              <el-table-column label="权重" width="100">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.weight" 
                    :min="1" 
                    :max="100" 
                    size="small"
                    controls-position="right"
                    class="weight-input"
                  />
                </template>
              </el-table-column>
              <!-- 右侧特有列：操作 -->
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button 
                    link 
                    type="primary" 
                    size="small"
                    @click="addPort(scope.row)"
                  >
                    添加端口
                  </el-button>
                  <el-button 
                    link 
                    type="danger" 
                    size="small"
                    @click="removeServer(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 右侧分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="rightCurrentPage"
                v-model:page-size="pageSize"
                :total="rightData.length"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  selectedServers: {
    type: Array,
    required: true
  },
  serverGroupName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:selectedServers', 'update:serverGroupName'])

// 使用本地变量来管理服务器组名称
const localServerGroupName = ref(props.serverGroupName)

// 监听props的变化，更新本地变量
watch(() => props.serverGroupName, (newValue) => {
  localServerGroupName.value = newValue
})

// 处理服务器组名称变化
const handleServerGroupNameChange = (value) => {
  localServerGroupName.value = value
  emit('update:serverGroupName', value)
}

// 查询参数
const searchParams = reactive({
  name: '',
  type: 'name'
})

// 分页参数
const leftCurrentPage = ref(1)
const rightCurrentPage = ref(1)
const pageSize = ref(10)

// 选择数据
const leftSelected = ref([])

// 模拟服务器数据
const allServers = ref([
  {
    id: 1,
    name: 'redis-vmxoz9g...',
    type: '实例主机',
    ip: '["10.42.253.90","34.0.2.58"]',
    spec: '1核1G/Cty...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 2,
    name: 'my-135803614',
    type: '实例主机',
    ip: '["10.42.253.83","34.0.128.28"]',
    spec: '2核4G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 3,
    name: 'my-611177126',
    type: '实例主机',
    ip: '["10.42.253.84","34.0.128.36"]',
    spec: '2核4G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 4,
    name: 'my-483970418',
    type: '实例主机',
    ip: '["10.42.253.88","34.0.128.40"]',
    spec: '2核4G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 5,
    name: 'ccseagent-vmi...',
    type: '实例主机',
    ip: '["10.42.253.81","34.0.2.57","10.42.254.59"]',
    spec: '4核8G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 6,
    name: 'ccseagent-vmii...',
    type: '实例主机',
    ip: '["10.42.253.80","34.0.2.56","10.42.254.52"]',
    spec: '4核8G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 7,
    name: 'udal-677333601',
    type: '实例主机',
    ip: '["10.42.253.74","34.0.129.73"]',
    spec: '2核8G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 8,
    name: 'udal-376201845',
    type: '实例主机',
    ip: '["10.42.253.75","34.0.129.74"]',
    spec: '2核8G/CTy...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 9,
    name: 'pg-917459197',
    type: '实例主机',
    ip: '["10.42.253.71","34.0.129.68"]',
    spec: '2核8G/tele...',
    state: '运行中',
    port: 80,
    weight: 50
  },
  {
    id: 10,
    name: 'pg-880820430',
    type: '实例主机',
    ip: '["10.42.253.72","34.0.129.71"]',
    spec: '2核8G/tele...',
    state: '运行中',
    port: 80,
    weight: 50
  }
])

// 左侧数据（所有服务器）
const leftData = ref([...allServers.value])
// 右侧数据（已选服务器）
const rightData = ref([])

// 分页数据
const leftPagedData = computed(() => {
  const start = (leftCurrentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return leftData.value.slice(start, end)
})

const rightPagedData = computed(() => {
  const start = (rightCurrentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return rightData.value.slice(start, end)
})

// 选择已有后端服务器组
const handleSelectExistingGroup = () => {
  ElMessage.info('选择已有后端服务器组功能待实现')
}

// 查询
const handleSearch = () => {
  const filtered = allServers.value.filter(server => {
    if (searchParams.name) {
      if (searchParams.type === 'name') {
        return server.name.includes(searchParams.name)
      } else if (searchParams.type === 'ip') {
        return server.ip.includes(searchParams.name)
      }
    }
    return true
  })
  
  // 过滤掉已在右侧的数据
  leftData.value = filtered.filter(server => 
    !rightData.value.some(rightServer => rightServer.id === server.id)
  )
  leftCurrentPage.value = 1
  ElMessage.info(`查询到${filtered.length}条记录`)
}

// 重置
const handleReset = () => {
  searchParams.name = ''
  searchParams.type = 'name'
  leftData.value = allServers.value.filter(server => 
    !rightData.value.some(rightServer => rightServer.id === server.id)
  )
  leftCurrentPage.value = 1
  ElMessage.info('已重置查询条件')
}

// 选择变化处理
const handleLeftSelectionChange = (selection) => {
  leftSelected.value = selection
}

// 修复的穿梭到右侧逻辑
const transferToRight = () => {
  if (leftSelected.value.length === 0) {
    ElMessage.warning('请先选择要添加的服务器')
    return
  }
  
  let addedCount = 0
  leftSelected.value.forEach(server => {
    // 检查服务器是否已经在右侧列表中
    const exists = rightData.value.some(rightServer => rightServer.id === server.id)
    if (!exists) {
      // 深拷贝服务器对象，避免引用问题
      const serverCopy = JSON.parse(JSON.stringify(server))
      rightData.value.push(serverCopy)
      addedCount++
    }
  })
  
  // 清空左侧选择状态
  leftSelected.value = []
  
  emit('update:selectedServers', rightData.value)
  
  if (addedCount > 0) {
    ElMessage.success(`成功添加${addedCount}台服务器`)
  } else {
    ElMessage.warning('选中的服务器已存在，未添加重复项')
  }
}

// 添加端口
const addPort = (server) => {
  ElMessage.info(`为服务器 ${server.name} 添加端口功能待实现`)
}

// 删除服务器
const removeServer = (server) => {
  const index = rightData.value.findIndex(s => s.id === server.id)
  if (index !== -1) {
    rightData.value.splice(index, 1)
    emit('update:selectedServers', rightData.value)
    ElMessage.success('服务器已移除')
  }
}

// 初始化
onMounted(() => {
  // 如果有传入的已选服务器，初始化右侧数据
  if (props.selectedServers && props.selectedServers.length > 0) {
    rightData.value = [...props.selectedServers]
    leftData.value = allServers.value.filter(server => 
      !rightData.value.some(rightServer => rightServer.id === server.id)
    )
  }
})
</script>

<style scoped>
.server-group-config {
  width: 100%;
  padding: 0 20px;
}

.config-container {
  width: 100%;
}

/* 第一行样式 */
.first-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label-text {
  font-size: 14px;
  color: #606266;
  margin-right: 16px;
}

/* 第二行样式 */
.second-row {
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  align-items: center;
}

.form-label {
  width: 160px;
  font-weight: 500;
  color: #606266;
  text-align: left;
  padding-right: 20px;
  flex-shrink: 0;
}

.form-label.required::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.name-input {
  width: 300px;
}

/* 第三行样式 */
.third-row {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-select {
  width: 100px;
}

.search-input {
  width: 200px;
}

/* 第四行：穿梭框布局 */
.transfer-layout {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.transfer-panel {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left-panel {
  margin-right: 0;
}

.right-panel {
  margin-left: 0;
}

.panel-header {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.count-text {
  font-size: 14px;
  color: #909399;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.transfer-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 0 10px;
}

.transfer-btn {
  width: 40px;
  height: 40px;
}

.ip-display {
  line-height: 1.4;
}

.ip-tags {
  margin-top: 4px;
}

.tag {
  font-size: 12px;
  color: #909399;
  margin-right: 4px;
}

.tag.private {
  color: #67c23a;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.port-input,
.weight-input {
  width: 80px;
}

/* 确保表格内容左对齐 */
:deep(.el-table th) {
  text-align: left;
}

:deep(.el-table td) {
  text-align: left;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}
</style>