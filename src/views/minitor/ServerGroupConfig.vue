<template>
  <div class="server-group-config">
    <div class="config-container">
      <!-- 第一行：选择已有后端服务器组 -->
      <div class="first-row">
        <span class="label-text">选择已有后端服务器组</span>
        <el-button type="primary" @click="showServerGroupDialog">
          选择后端服务器组
        </el-button>
        <el-button
          v-if="isExistingGroupSelected"
          @click="handleCancelSelection"
          class="cancel-selection-btn"
        >
          取消选择
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

      <!-- 第三行和第四行（穿梭框）在选择已有服务器组后隐藏 -->
      <div v-if="!isExistingGroupSelected" class="manual-config-section">
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
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="addDuplicateServer(scope.row)"
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

      <!-- 选择已有后端服务器组对话框 -->
      <el-dialog
        v-model="serverGroupDialogVisible"
        title="选择后端服务器组"
        width="800px"
        :before-close="handleDialogClose"
      >
        <div class="server-group-dialog">
          <!-- 服务器组列表表格 - 使用单选模式 -->
          <el-table
            :data="filteredServerGroups"
            style="width: 100%"
            @row-click="handleServerGroupRowClick"
            :row-class-name="getRowClassName"
            empty-text="暂无数据"
          >
            <el-table-column width="55">
              <template #default="scope">
                <el-radio
                  v-model="selectedServerGroupId"
                  :label="scope.row.id"
                  @change="handleServerGroupRadioChange(scope.row)"
                >
                  &nbsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="后端服务器组名称" min-width="200" />
            <el-table-column prop="protocol" label="后端协议" width="120">
              <template #default="scope">
                <span>{{ getProtocolDisplay(scope.row.protocol) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="serverCount" label="后端服务器数量" width="140">
              <template #default="scope">
                <span>{{ scope.row.serverCount }} 台</span>
              </template>
            </el-table-column>
            <el-table-column prop="healthCheck" label="健康检查" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.healthCheck ? 'success' : 'info'" size="small">
                  {{ scope.row.healthCheck ? '开启' : '关闭' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
              <template #default="scope">
                <span>{{ formatDate(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleDialogClose">取消</el-button>
            <el-button
              type="primary"
              :disabled="!selectedServerGroupId"
              @click="handleServerGroupConfirm"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
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
const isExistingGroupSelected = ref(false)

// 监听props的变化，更新本地变量
watch(() => props.serverGroupName, (newValue) => {
  localServerGroupName.value = newValue
})

// 处理服务器组名称变化
const handleServerGroupNameChange = (value) => {
  localServerGroupName.value = value
  emit('update:serverGroupName', value)
  // 如果用户手动输入名称，则标记为非选择现有组
  if (value && value !== selectedServerGroupName.value) {
    isExistingGroupSelected.value = false
  }
}

// 取消选择现有服务器组
const handleCancelSelection = () => {
  isExistingGroupSelected.value = false
  localServerGroupName.value = ''
  emit('update:serverGroupName', '')
  selectedServerGroupId.value = null
  selectedServerGroupName.value = ''
  ElMessage.info('已取消选择现有服务器组')
}

// 对话框显示状态
const serverGroupDialogVisible = ref(false)
const selectedServerGroupId = ref(null)
const selectedServerGroupName = ref('')

// 模拟已有的后端服务器组数据
const serverGroups = ref([
  {
    id: 'tg-s1pnvwbiwu',
    name: 'test-8002',
    protocol: 'tcp',
    serverCount: 3,
    healthCheck: true,
    createTime: '2025-08-07T02:09:47Z',
    algorithm: 'wrr',
    status: 'ACTIVE'
  },
  {
    id: 'tg-vhtsss8pl3',
    name: 'scwtnew-8001',
    protocol: 'http',
    serverCount: 5,
    healthCheck: true,
    createTime: '2025-07-02T02:17:38Z',
    algorithm: 'wrr',
    status: 'ACTIVE'
  },
  {
    id: 'tg-0it0e2buxb',
    name: 'coroot-8000',
    protocol: 'https',
    serverCount: 2,
    healthCheck: false,
    createTime: '2025-05-16T08:22:42Z',
    algorithm: 'wrr',
    status: 'ACTIVE'
  },
  {
    id: 'tg-soj19any9w',
    name: 'tg-ccseagent-elb-5EHl5LCVGj',
    protocol: 'tcp',
    serverCount: 8,
    healthCheck: true,
    createTime: '2024-11-19T06:28:40Z',
    algorithm: 'wrr',
    status: 'ACTIVE'
  }
])

// 过滤后的服务器组
const filteredServerGroups = computed(() => {
  return serverGroups.value
})

// 显示选择服务器组对话框
const showServerGroupDialog = () => {
  serverGroupDialogVisible.value = true
  selectedServerGroupId.value = null
  selectedServerGroupName.value = ''
}

// 处理服务器组行点击
const handleServerGroupRowClick = (row) => {
  selectedServerGroupId.value = row.id
  selectedServerGroupName.value = row.name
}

// 处理单选按钮变化
const handleServerGroupRadioChange = (row) => {
  selectedServerGroupId.value = row.id
  selectedServerGroupName.value = row.name
}

// 获取行类名
const getRowClassName = ({ row }) => {
  return selectedServerGroupId.value === row.id ? 'selected-row' : ''
}

// 确认选择服务器组
const handleServerGroupConfirm = () => {
  if (selectedServerGroupId.value) {
    // 填充服务器组名称到输入框
    localServerGroupName.value = selectedServerGroupName.value
    emit('update:serverGroupName', selectedServerGroupName.value)

    // 标记为已选择现有服务器组
    isExistingGroupSelected.value = true

    // 清空手动选择的服务器，因为使用了现有服务器组
    emit('update:selectedServers', [])

    ElMessage.success(`已选择服务器组: ${selectedServerGroupName.value}`)
    serverGroupDialogVisible.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  serverGroupDialogVisible.value = false
}

// 获取协议显示名称
const getProtocolDisplay = (protocol) => {
  const protocolMap = {
    'tcp': 'TCP',
    'http': 'HTTP',
    'https': 'HTTPS'
  }
  return protocolMap[protocol] || protocol.toUpperCase()
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 以下是手动配置服务器相关的代码
const searchParams = reactive({
  name: '',
  type: 'name'
})

const leftCurrentPage = ref(1)
const rightCurrentPage = ref(1)
const pageSize = ref(10)
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

// 穿梭到右侧
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

// 修改后的"添加端口"功能 - 复制相同主机
const addDuplicateServer = (server) => {
  // 深拷贝服务器对象
  const newServer = JSON.parse(JSON.stringify(server))

  // 生成新的ID避免重复
  newServer.id = Date.now() + Math.floor(Math.random() * 1000)

  // 修改名称，添加副本标识
  newServer.name = `${server.name}-副本`

  // 添加到右侧列表
  rightData.value.push(newServer)

  // 更新父组件数据
  emit('update:selectedServers', rightData.value)

  ElMessage.success(`已添加一台相同配置的主机: ${newServer.name}`)
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
  gap: 16px;
}

.label-text {
  font-size: 14px;
  color: #606266;
}

.cancel-selection-btn {
  margin-left: 10px;
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

/* 对话框样式 */
.server-group-dialog {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 单选表格行选中样式 */
:deep(.selected-row) {
  background-color: #f0f9ff;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-table .cell) {
  display: flex;
  align-items: center;
}

/* 确保对话框居中显示 */
:deep(.el-dialog) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}

:deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
