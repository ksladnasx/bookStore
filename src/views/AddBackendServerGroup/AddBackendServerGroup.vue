<template>
  <div>
    <el-backtop :right="60" :bottom="100" style="background-color: transparent;color: red;"/>
  </div>
  <div>
    {{ moreinfo.address }}-{{ moreinfo.phone }}
  </div>


  <div class="add-backend-server-group">
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <span class="page-title">添加后端服务器组 </span>
        <el-tooltip content="配置服务器组的基本信息，包括名称、协议和端口" placement="top">
          <el-icon class="help-icon">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 主要内容区域 -->
      <div class="content-container">
        <!-- 服务器组基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <div class="form-content">
            <div class="form-item">
              <span class="form-label required">后端服务器组名称</span>
              <div class="form-control">
                <el-input v-model="serverGroupForm.name" placeholder="请输入后端服务器组名称" class="name-input" maxlength="32"
                  show-word-limit /><el-button @click="getData">获取数据</el-button>
              </div>
            </div>

          </div>
        </div>

        <!-- 服务器选择区域 -->
        <div class="form-section">
          <h3 class="section-title">选择服务器</h3>
          <div class="search-section">
            <div class="search-form">
              <el-select v-model="searchParams.type" class="type-select">
                <el-option label="名称" value="name" />
                <el-option label="IP" value="ip" />
              </el-select>
              <el-input v-model="searchParams.keyword" placeholder="请输入名称" class="search-input" />
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </div>

          <!-- 穿梭框布局 -->
          <div class="transfer-layout">
            <!-- 左侧：可选服务器列表 -->
            <div class="transfer-panel left-panel">
              <div class="panel-header">
                <span>服务器列表</span>
                <span class="count-text">共{{ filteredLeftData.length }}条</span>
              </div>
              <div class="panel-content">
                <el-table :data="leftPagedData" style="width: 100%" @selection-change="handleLeftSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="name" label="服务器名称" min-width="180" />
                  <el-table-column prop="type" label="服务器类型" width="120" />
                  <el-table-column prop="ip" label="IP" min-width="250">
                    <template #default="scope">
                      <div class="ip-display">
                        {{ scope.row.ip }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="spec" label="计算规格" width="120" />
                  <el-table-column prop="state" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getStatusTagType(scope.row.state)" size="small">
                        {{ scope.row.state }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 左侧分页 -->
                <div class="pagination-container">
                  <el-pagination v-model:current-page="leftCurrentPage" v-model:page-size="pageSize"
                    :total="filteredLeftData.length" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" />
                </div>
              </div>
            </div>

            <!-- 中间：穿梭按钮 -->
            <div class="transfer-controls">
              <el-button type="primary" :disabled="leftSelected.length === 0" @click="transferToRight"
                class="transfer-btn">
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </el-button>
              <el-button type="primary" :disabled="rightSelected.length === 0" @click="transferToLeft"
                class="transfer-btn">
                <el-icon>
                  <ArrowLeft />
                </el-icon>
              </el-button>
            </div>

            <!-- 右侧：已选主机-->
            <div class="transfer-panel right-panel">
              <div class="panel-header">
                <span>已选服务器</span>
                <span class="count-text">共{{ rightData.length }}条</span>
              </div>
              <div class="panel-content">
                <el-table :data="rightPagedData" style="width: 100%" @selection-change="handleRightSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="name" label="服务器名称" min-width="180" />
                  <el-table-column prop="type" label="服务器类型" width="120" />
                  <el-table-column prop="ip" label="IP" min-width="250">
                    <template #default="scope">
                      <div class="ip-display">
                        {{ scope.row.ip }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="spec" label="计算规格" width="120" />
                  <el-table-column prop="state" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getStatusTagType(scope.row.state)" size="small">
                        {{ scope.row.state }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <!-- 右侧特有列：端口 -->
                  <el-table-column label="端口" width="100">
                    <template #default="scope">
                      <el-input v-model="scope.row.port" :min="1" :max="65535" size="small" controls-position="right"
                        class="port-input" />
                    </template>
                  </el-table-column>
                  <!-- 右侧特有列：权重 -->
                  <el-table-column label="权重" width="100">
                    <template #default="scope">
                      <el-input v-model="scope.row.weight" :min="1" :max="100" size="small" controls-position="right"
                        class="weight-input" />
                    </template>
                  </el-table-column>
                  <!-- 右侧特有列：操作 -->
                  <el-table-column label="操作" width="120">
                    <template #default="scope">
                      <el-button link type="primary" size="small" @click="addDuplicateServer(scope.row)">
                        添加端口
                      </el-button>
                      <el-button link type="danger" size="small" @click="removeServer(scope.row)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 右侧分页 -->
                <div class="pagination-container">
                  <el-pagination v-model:current-page="rightCurrentPage" v-model:page-size="pageSize"
                    :total="rightData.length" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级配置 -->
        <div class="form-section">
          <h3 class="section-title">高级配置</h3>
          <div class="form-content">
            <div class="form-item">
              <span class="form-label">后端服务器组协议</span>
              <div class="form-control">
                <el-select v-model="serverGroupForm.protocol" class="protocol-select">
                  <el-option label="TCP" value="tcp" />
                  <el-option label="UDP" value="udp" />
                  <el-option label="HTTP" value="http" />
                  <el-option label="HTTPS" value="https" />
                </el-select>
              </div>
            </div>
            <div class="form-item" style="display: flex;flex-direction: column;">
              <div style="flex: 1;">
                <span class="form-label">会话保持模式<el-tooltip v-if="currentSessionHint" :content="currentSessionHint"
                    placement="top">
                    <el-icon class="help-icon">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip></span>

                <span style="padding-left:30px;padding-right: 10px;">

                  <el-switch v-model="isOpensession"
                  :disabled="serverGroupForm.algorithm == 'sh' || serverGroupForm.algorithm == 'lc'" />
                </span>

                <el-select v-model="serverGroupForm.sessionStickyMode" class="session-mode-select" v-if="isOpensession"
                  :disabled="isSessionStickyDisabled">
                  <el-option v-for="option in sessionStickyModeOptions" :key="option.value" :label="option.label"
                    :value="option.value" />
                </el-select>


              </div>

              <div class="form-control" v-if="isOpensession">
                <span class="form-label">模式配置</span>

                <!-- 源IP模式配置 -->
                <div v-if="serverGroupForm.sessionStickyMode === sessionStates.sourceIp" class="session-config">
                  <span class="config-label">超时时间（秒）</span>
                  <el-input-number v-model="serverGroupForm.sessionTimeout" :min="1" :max="3600"
                    controls-position="right" class="timeout-input" />
                  <span class="timeout-unit">秒</span>
                </div>

                <!-- Cookie模式配置 -->
                <div
                  v-if="serverGroupForm.sessionStickyMode === sessionStates.insert || serverGroupForm.sessionStickyMode === sessionStates.rewrite"
                  class="session-config">
                  <span class="config-label">Cookie名称</span>
                  <el-input v-model="serverGroupForm.cookieName" placeholder="请输入Cookie名称" class="cookie-input" />
                  <span class="config-label">过期时间(s)</span>
                  <el-input-number v-model="serverGroupForm.cookieExpire" :min="1" :max="86400"
                    controls-position="right" class="expire-input" />
                  <span class="timeout-unit">秒</span>
                </div>

              </div>
            </div>
            <div class="form-item">
              <span class="form-label">分配策略类型</span>
              <div class="form-control">
                <el-select v-model="serverGroupForm.algorithm" class="algorithm-select">
                  <el-option label="轮询算法" value="rr" />
                  <el-option label="带权重轮询算法" value="wrr" />
                  <el-option label="最少连接算法" value="lc" />
                  <el-option label="源IP哈希算法" value="sh" />
                </el-select>
              </div>
            </div>
            <div class="form-item">
              <span class="form-label">描述</span>
              <div class="form-control">
                <el-input v-model="serverGroupForm.description" type="textarea" :rows="3" placeholder="请输入描述信息"
                  class="description-input" maxlength="200" show-word-limit />
              </div>
            </div>
          </div>
        </div>

        <!-- 健康检查配置 -->
        <div class="form-section">
          <h3 class="section-title">健康检查</h3>
          <div class="form-content">
            <div class="form-item">
              <span class="form-label">是否开启</span>
              <div class="form-control">
                <el-switch v-model="healthCheckForm.enabled" />
              </div>
            </div>
            <template v-if="healthCheckForm.enabled">
              <div class="form-item">
                <span class="form-label">健康检查协议</span>
                <div class="form-control">
                  <el-select v-model="healthCheckForm.protocol" class="health-protocol-select">
                    <el-option label="TCP" value="tcp" />
                    <el-option label="UDP" value="udp" />
                    <el-option label="HTTP" value="http" />
                    <el-option label="HTTPS" value="https" />
                  </el-select>
                </div>
              </div>
              <div class="form-item">
                <span class="form-label">检查间隔（秒）</span>
                <div class="form-control">
                  <el-input-number v-model="healthCheckForm.interval" :min="1" :max="20940" controls-position="right"
                    class="interval-input" />
                  <span class="range-hint">取值范围1-20940</span>
                </div>
              </div>
              <div class="form-item">
                <span class="form-label">超时时间（秒）</span>
                <div class="form-control">
                  <el-input-number v-model="healthCheckForm.timeout" :min="2" :max="60" controls-position="right"
                    class="timeout-input" />
                  <span class="range-hint">取值范围2-60</span>
                </div>
              </div>
              <div class="form-item">
                <span class="form-label">最大重试次数</span>
                <div class="form-control">
                  <el-input-number v-model="healthCheckForm.maxRetries" :min="1" :max="10" controls-position="right"
                    class="retries-input" />
                  <span class="range-hint">取值范围1-10</span>
                </div>
              </div>
              <div v-if="healthCheckForm.protocol === 'http' || healthCheckForm.protocol === 'https'" class="form-item">
                <span class="form-label">检查路径</span>
                <div class="form-control">
                  <el-input v-model="healthCheckForm.path" placeholder="/health" class="path-input" />
                </div>
              </div>
              <div v-if="healthCheckForm.protocol === 'http' || healthCheckForm.protocol === 'https'" class="form-item">
                <span class="form-label">期望状态码</span>
                <div class="form-control">
                  <el-input v-model="healthCheckForm.expectedCode" placeholder="200" class="status-code-input" />
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="action-buttons">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
//import { getElbBackendGroup, fetchElbBackend } from '@/apis/ctyun/index'
defineProps({
  moreinfo: {
    type: Object,
    default: () => ({
      address: '',
      phone: ''
    })
  }
})
// 响应式数据定义
const allServers = ref([])
const loading = ref(false)
const error = ref(null)
const rightData = ref([])
const isOpensession = ref(false)
// 会话状态定义
const sessionStates = {
  close:"CLOSE",
  insert:"INSERT",
  rewrite:"REWRITE",
  sourceIp:"SOURCE_IP"
}

// 修改后的服务器组表单数据
const serverGroupForm = reactive({
  name: '',
  description: '',
  protocol: 'tcp',
  // 会话保持模式：CLOSE（关闭）、INSERT（插入）、REWRITE（重写）、SOURCE_IP（源地址）
  sessionStickyMode: sessionStates.sourceIp,
  sessionTimeout: 1800,
  cookieName: '',
  cookieExpire: 3600,
  algorithm: 'rr'
})

// 健康检查表单数据保持不变
const healthCheckForm = reactive({
  enabled: true,
  protocol: 'tcp',
  interval: 5,
  timeout: 2,
  maxRetries: 2,
  path: '/health',
  expectedCode: '200'
})



// 计算属性：会话保持模式选项
const sessionStickyModeOptions = computed(() => {
const options = computed(() => {
    if (!isOpensession.value) {
      return [{ label: '关闭', value: sessionStates.close }]
    } else {
      if(serverGroupForm.protocol === 'tcp' || serverGroupForm.protocol === 'udp') {
        return [
          { label: '源IP', value: sessionStates.sourceIp }
        ]
      }else{
        return [
          { label: '插入Cookie', value: sessionStates.insert },
          { label: '重写Cookie', value: sessionStates.rewrite },
          { label: '源IP', value: sessionStates.sourceIp }
        ]
      }
    }
  })
  // 如果算法是lc或sh，强制关闭会话保持
  if (serverGroupForm.algorithm === 'lc' || serverGroupForm.algorithm === 'sh') {
    return options.value.map(opt => ({
      ...opt,
      disabled: opt.value !== sessionStates.close
    }))
  }

  // 如果协议是TCP或UDP，只允许CLOSE和SOURCE_IP
  if (serverGroupForm.protocol === 'tcp' || serverGroupForm.protocol === 'udp') {
    return options.value.map(opt => ({
      ...opt,
      disabled: ![sessionStates.close, sessionStates.sourceIp].includes(opt.value)
    }))
  }

  // HTTP/HTTPS协议支持所有模式
  return options.value.map(opt => ({ ...opt, disabled: false }))
})

// 计算属性：会话保持是否被禁用
const isSessionStickyDisabled = computed(() => {
  return serverGroupForm.algorithm === 'lc' || serverGroupForm.algorithm === 'sh'
})

// 计算属性：当前会话保持提示信息
const currentSessionHint = computed(() => {
  if (serverGroupForm.algorithm === 'lc' || serverGroupForm.algorithm === 'sh') {
    return '最少连接算法(lc)和源IP哈希算法(sh)不支持会话保持功能'
  }

  if ((serverGroupForm.protocol === 'tcp' || serverGroupForm.protocol === 'udp') &&
    ![sessionStates.close, sessionStates.sourceIp].includes(serverGroupForm.sessionStickyMode)) {
    return 'TCP/UDP协议仅支持基于源地址的会话保持模式'
  }

  if (serverGroupForm.sessionStickyMode === sessionStates.sourceIp) {
    return '基于源IP的会话保持：将同一源IP的请求转发到同一台后端服务器'
  }

  if (serverGroupForm.sessionStickyMode === sessionStates.insert || serverGroupForm.sessionStickyMode === sessionStates.rewrite) {
    return '基于Cookie的会话保持：适用于HTTP/HTTPS协议，可提供更精确的会话跟踪'
  }

  return null
})

// 协议变化处理
const handleProtocolChange = (newProtocol) => {
  // 如果切换到TCP/UDP协议，且当前会话保持模式不是CLOSE或SOURCE_IP，自动调整为SOURCE_IP
  if ((newProtocol === 'tcp' || newProtocol === 'udp') &&
    ![sessionStates.close, sessionStates.sourceIp].includes(serverGroupForm.sessionStickyMode)) {
    serverGroupForm.sessionStickyMode = sessionStates.sourceIp
    ElMessage.info('TCP/UDP协议已自动切换为源地址会话保持模式')
  }

  // 如果切换到HTTP/HTTPS协议，且当前是CLOSE模式，可以设置为默认的INSERT模式
  if ((newProtocol === 'http' || newProtocol === 'https') &&
    serverGroupForm.sessionStickyMode === sessionStates.close &&
    !isSessionStickyDisabled.value) {
    serverGroupForm.sessionStickyMode = sessionStates.insert
  }
}

// 算法变化处理
const handleAlgorithmChange = (newAlgorithm) => {
  // 如果切换到不支持会话保持的算法，强制关闭会话保持
  if (newAlgorithm === 'lc' || newAlgorithm === 'sh') {
    serverGroupForm.sessionStickyMode = sessionStates.close
    isOpensession.value = false
    ElMessage.warning('当前分配策略类型已自动关闭会话保持功能')
  } else if (serverGroupForm.sessionStickyMode === sessionStates.close) {
    // 如果从不支持会话保持的算法切换到支持的模式，且当前是关闭状态，设置为默认模式
    const defaultMode = (serverGroupForm.protocol === 'tcp' || serverGroupForm.protocol === 'udp')
      ? sessionStates.sourceIp
      : sessionStates.insert
    serverGroupForm.sessionStickyMode = defaultMode
  }
}

// 监听协议变化，自动调整会话保持模式
watch(() => serverGroupForm.protocol, (newProtocol) => {
  handleProtocolChange(newProtocol)
})

// 监听算法变化，自动调整会话保持模式
watch(() => serverGroupForm.algorithm, (newAlgorithm) => {
  handleAlgorithmChange(newAlgorithm)
})

// 数据转换函数和其他现有函数保持不变
function transformBackendToFrontend(backendData) {
  const stateMap = {
    'ACTIVE': '运行中',
    'DOWN': '离线',
    'unknown': '状态未知'
  };

  const typeMap = {
    'VM': '实例主机',
    'BM': "独立主机"
  };

  return {
    id: backendData.instanceID || backendData.id,
    name: backendData.id ? `${backendData.id}` : '未知主机',
    type: typeMap[backendData.instanceType] || backendData.instanceType,
    ip: backendData.instanceIP || '',
    spec: '2核4G',
    state: stateMap[backendData.status] || '状态异常',
    port: backendData.protocolPort || 80,
    weight: backendData.weight || 1
  };
}

// 加载数据的函数
const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    const backendDataArray = await fetchElbBackend(1, "yx")
    console.log("后端返回数据:", backendDataArray)

    if (backendDataArray && Array.isArray(backendDataArray.data)) {
      allServers.value = backendDataArray.data.map(item => transformBackendToFrontend(item))
      console.log("转换后的前端数据:", allServers.value)
    } else {
      console.error("后端返回的数据格式不正确:", backendDataArray)
      error.value = "数据格式错误"
      ElMessage.error('数据格式错误')
    }
  } catch (err) {
    console.error("数据加载失败:", err)
    error.value = err.message
    ElMessage.error('数据加载失败: ' + err.message)
  } finally {
    loading.value = false
  }
}

// 手动获取数据的函数
const getData = async () => {
  await loadData()
}

// 计算属性：左侧可用服务器
const leftData = computed(() => {
  return allServers.value
})

// 搜索参数
const searchParams = reactive({
  type: 'name',
  keyword: ''
})

// 分页参数
const leftCurrentPage = ref(1)
const rightCurrentPage = ref(1)
const pageSize = ref(10)

// 选择数据
const leftSelected = ref([])
const rightSelected = ref([])

// 过滤后的左侧数据
const filteredLeftData = computed(() => {
  if (!searchParams.keyword) {
    return leftData.value
  }

  return leftData.value.filter(server => {
    if (searchParams.type === 'name') {
      return server.name.includes(searchParams.keyword)
    } else if (searchParams.type === 'ip') {
      return server.ip.includes(searchParams.keyword)
    }
    return true
  })
})

// 分页数据
const leftPagedData = computed(() => {
  const start = (leftCurrentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLeftData.value.slice(start, end)
})

const rightPagedData = computed(() => {
  const start = (rightCurrentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return rightData.value.slice(start, end)
})

// 获取状态标签类型
const getStatusTagType = (state) => {
  const statusMap = {
    '运行中': 'success',
    '停止': 'danger',
    '异常': 'warning',
    '创建中': 'info'
  }
  return statusMap[state] || 'info'
}

// 查询与重置
const handleSearch = () => {
  leftCurrentPage.value = 1
  ElMessage.info(`查询到${filteredLeftData.value.length}条记录`)
}
const handleReset = () => {
  searchParams.keyword = ''
  searchParams.type = 'name'
  leftCurrentPage.value = 1
  ElMessage.info('已重置查询条件')
}

// 选择变化处理
const handleLeftSelectionChange = (selection) => {
  leftSelected.value = selection
}

const handleRightSelectionChange = (selection) => {
  rightSelected.value = selection
}

// 穿梭到右侧
const transferToRight = () => {
  if (leftSelected.value.length === 0) {
    ElMessage.warning('请先选择要添加的服务器')
    return
  }

  let addedCount = 0
  leftSelected.value.forEach(server => {
    const exists = rightData.value.some(rightServer => rightServer.id === server.id)
    if (!exists) {
      const serverCopy = JSON.parse(JSON.stringify(server))
      rightData.value.push(serverCopy)
      addedCount++
    }
  })

  leftSelected.value = []
  leftCurrentPage.value = 1

  if (addedCount > 0) {
    ElMessage.success(`成功添加${addedCount}台服务器`)
  } else {
    ElMessage.warning('选中的服务器已存在，未添加重复项')
  }
}

// 穿梭到左侧
const transferToLeft = () => {
  if (rightSelected.value.length === 0) {
    ElMessage.warning('请先选择要移除的服务器')
    return
  }

  const removedCount = rightSelected.value.length
  rightData.value = rightData.value.filter(server =>
    !rightSelected.value.some(selected => selected.id === server.id)
  )

  rightSelected.value = []
  rightCurrentPage.value = 1

  ElMessage.success(`成功移除${removedCount}台服务器`)
}

// 添加相同主机不同端口
const addDuplicateServer = (server) => {
  const newServer = JSON.parse(JSON.stringify(server))
  newServer.id = `${server.id}`
  newServer.name = `${server.name}`
  newServer.port = server.port+1
  rightData.value.push(newServer)
  ElMessage.success(`已添加一台相同配置的主机: ${newServer.name}`)
}

// 删除服务器
const removeServer = (server) => {
  const index = rightData.value.findIndex(s => s.id === server.id)
  if (index !== -1) {
    rightData.value.splice(index, 1)
    ElMessage.success('服务器已移除')
  }
}

// 提交表单（添加验证逻辑）
const handleSubmit = () => {
  // 验证算法和会话保持模式的约束
  if (['lc', 'sh'].includes(serverGroupForm.algorithm) && serverGroupForm.sessionStickyMode !== sessionStates.close) {
    ElMessage.error('最少连接算法和源IP哈希算法不能开启会话保持')
    return
  }

  // 验证协议和会话保持模式的约束
  if (['tcp', 'udp'].includes(serverGroupForm.protocol) &&
    ![sessionStates.close, sessionStates.sourceIp].includes(serverGroupForm.sessionStickyMode)) {
    ElMessage.error('TCP/UDP协议仅支持源地址会话保持模式')
    return
  }

  // 原有验证逻辑
  if (!serverGroupForm.name.trim()) {
    ElMessage.error('请输入后端服务器组名称')
    return
  }

  if (rightData.value.length === 0) {
    ElMessage.error('请至少选择一台服务器')
    return
  }

  if (!serverGroupForm.algorithm) {
    ElMessage.error('请选择分配策略类型')
    return
  }

  //会话模式配置的计算
  const sessionSticky = computed(()=>{
    if(serverGroupForm.sessionStickyMode == sessionStates.close){
      return {sessionStickyMode:sessionStates.close}
    }else if (serverGroupForm.sessionStickyMode == sessionStates.insert){
      return {
        sessionStickyMode:sessionStates.insert,
        cookieExpire:serverGroupForm.cookieExpire
      }
    }else if (serverGroupForm.sessionStickyMode == sessionStates.rewrite){
      return {
        sessionStickyMode:sessionStates.rewrite,
        rewriteCookieName:serverGroupForm.cookieName
      }
    }else if (serverGroupForm.sessionStickyMode == sessionStates.sourceIp){
      return {
        sessionStickyMode:sessionStates.sourceIp,
        sourceIpTimeout:serverGroupForm.sessionTimeout
      }
    }
    return {sessionStickyMode:sessionStates.close}
  })
  const submitData = {
    clientToken: "",
    protocol: serverGroupForm.protocol,
    regionID: "",
    name: serverGroupForm.name,
    description: serverGroupForm.description,
    vpcID: "",
    healthCheckID: "",
    algorithm: serverGroupForm.algorithm,
    sessionSticky: sessionSticky.value, // 使用新的会话保持模式字段
    proxyProtocol: "",
    serverGroup: {
      servers: rightData.value.map(server => ({
        id: server.id,
        name: server.name,
        ip: server.ip,
        port: server.port || 80,
        weight: server.weight || 50
      }))
    },
    healthCheck: healthCheckForm.enabled ? healthCheckForm : null
  }

  console.log('提交的后端服务器组数据:', submitData)
  ElMessage.success('后端服务器组创建成功！')
}

// 取消操作
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要取消创建吗？所有未保存的更改将丢失。',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // 添加自定义类名防止样式干扰
        customClass: 'cancel-confirm-dialog'
      }
    )
    ElMessage.info('已取消创建')
  } catch (error) {
    console.log('用户取消了取消操作')
  }
}

// 初始化
onMounted(async () => {
  // 设置默认值
  if (!serverGroupForm.algorithm) {
    serverGroupForm.algorithm = 'rr'
  }
  if (healthCheckForm.enabled === undefined) {
    healthCheckForm.enabled = true
  }

  // 加载数据
  await loadData()
})
</script>

<style scoped>
.add-backend-server-group {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  padding: 20px 30px;
  border-bottom: 1px solid #ebeef5;
  background-color: #ffffff;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.content-container {
  padding: 30px;
}

.form-section {
  margin-bottom: 32px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  background-color: #f5f7fa;
  padding: 16px 20px;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

.form-content {
  padding: 20px;
  background-color: #ffffff;
}

.form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  width: 160px;
  font-weight: 500;
  color: #606266;
  text-align: left;
  padding-right: 20px;
  flex-shrink: 0;
  line-height: 32px;
}

.form-label.required::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.form-control {

  display: flex;
  align-items: center;

}

.name-input {
  width: 300px;
}

.description-input {
  width: 100%;
  max-width: 500px;
}

.protocol-select,
.algorithm-select,
.health-protocol-select {
  width: 200px;
}

.session-type-select {
  width: 120px;
  margin-right: 10px;
}

.timeout-input {
  width: 100px;
}

.timeout-unit {
  margin-left: 8px;
  color: #606266;
}

.interval-input,
.timeout-input,
.retries-input {
  width: 120px;
}

.path-input,
.status-code-input {
  width: 200px;
}

.range-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
  white-space: nowrap;
}

.session-config {
  display: flex;
  align-items: center;
}

/* 搜索区域 */
.search-section {
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

/* 穿梭框布局 */
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

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.port-input,
.weight-input {
  width: 80px;
}

/* 底部按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
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

/* 响应式调整 */
@media (max-width: 1200px) {
  .transfer-layout {
    flex-direction: column;
  }

  .transfer-controls {
    flex-direction: row;
    justify-content: center;
    padding: 10px 0;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }

  .form-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-label {
    width: 100%;
    margin-bottom: 8px;
    padding-right: 0;
  }

  .form-control {
    width: 100%;
  }

  .search-form {
    flex-wrap: wrap;
  }
}

.session-config {
  margin-top: 12px;
  padding: 0px;
}

.config-label {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  color: #606266;
}

.session-mode-select {
  width: 200px;
}

.timeout-input,
.expire-input {
  width: 120px;
  margin-right: 8px;
}

.cookie-input {
  width: 200px;
  margin-right: 16px;
}

.timeout-unit {
  color: #909399;
  font-size: 14px;
}

.rule-hint {
  margin-top: 12px;
}

.hint-alert {
  padding: 8px 16px;
}

:deep(.el-alert__title) {
  font-size: 13px;
  line-height: 1.4;
}
/* el提示框样式不受style影响 */

/* 去掉点点 */
:deep(.el-table .cell) {
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1 !important;
  text-overflow: unset !important;
  overflow: unset !important;
}
</style>
