<template>
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
                                <el-input v-model="serverGroupForm.name" placeholder="请输入后端服务器组名称" class="name-input"
                                    maxlength="32" show-word-limit />
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
                                <el-table :data="leftPagedData" style="width: 100%"
                                    @selection-change="handleLeftSelectionChange">
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

                        <!-- 右侧：已选服务器组 -->
                        <div class="transfer-panel right-panel">
                            <div class="panel-header">
                                <span>已选服务器组</span>
                                <span class="count-text">共{{ rightData.length }}条</span>
                            </div>
                            <div class="panel-content">
                                <el-table :data="rightPagedData" style="width: 100%"
                                    @selection-change="handleRightSelectionChange">
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
                                            <el-input-number v-model="scope.row.port" :min="1" :max="65535" size="small"
                                                controls-position="right" class="port-input" />
                                        </template>
                                    </el-table-column>
                                    <!-- 右侧特有列：权重 -->
                                    <el-table-column label="权重" width="100">
                                        <template #default="scope">
                                            <el-input-number v-model="scope.row.weight" :min="1" :max="100" size="small"
                                                controls-position="right" class="weight-input" />
                                        </template>
                                    </el-table-column>
                                    <!-- 右侧特有列：操作 -->
                                    <el-table-column label="操作" width="120">
                                        <template #default="scope">
                                            <el-button link type="primary" size="small"
                                                @click="addDuplicateServer(scope.row)">
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
                            <span class="form-label">后端协议</span>
                            <div class="form-control">
                                <el-select v-model="serverGroupForm.protocol" class="protocol-select">
                                    <el-option label="TCP" value="tcp" />
                                    <el-option label="HTTP" value="http" />
                                    <el-option label="HTTPS" value="https" />
                                </el-select>
                            </div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">会话保持</span>
                            <div class="form-control">
                                <el-switch v-model="serverGroupForm.sessionPersistence" />
                                <div v-if="serverGroupForm.sessionPersistence" class="session-config">
                                    <el-select v-model="serverGroupForm.sessionType" class="session-type-select">
                                        <el-option label="源IP" value="source_ip" />
                                        <el-option label="Cookie" value="cookie" />
                                    </el-select>
                                    <el-input-number v-if="serverGroupForm.sessionType === 'source_ip'"
                                        v-model="serverGroupForm.sessionTimeout" :min="1" :max="3600"
                                        controls-position="right" class="timeout-input" />
                                    <span v-if="serverGroupForm.sessionType === 'source_ip'"
                                        class="timeout-unit">秒</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">分配策略类型</span>
                            <div class="form-control">
                                <el-select v-model="serverGroupForm.algorithm" class="algorithm-select">
                                    <el-option label="轮询算法" value="round_robin" />
                                    <el-option label="带权重轮询算法" value="weighted_round_robin" />
                                    <el-option label="最少连接算法" value="least_connections" />
                                    <el-option label="源IP哈希算法" value="source_ip_hash" />
                                </el-select>
                            </div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">描述</span>
                            <div class="form-control">
                                <el-input v-model="serverGroupForm.description" type="textarea" :rows="3"
                                    placeholder="请输入描述信息" class="description-input" maxlength="200" show-word-limit />
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
                                        <el-option label="HTTP" value="http" />
                                        <el-option label="HTTPS" value="https" />
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-item">
                                <span class="form-label">检查间隔（秒）</span>
                                <div class="form-control">
                                    <el-input-number v-model="healthCheckForm.interval" :min="1" :max="20940"
                                        controls-position="right" class="interval-input" />
                                    <span class="range-hint">取值范围1-20940</span>
                                </div>
                            </div>
                            <div class="form-item">
                                <span class="form-label">超时时间（秒）</span>
                                <div class="form-control">
                                    <el-input-number v-model="healthCheckForm.timeout" :min="2" :max="60"
                                        controls-position="right" class="timeout-input" />
                                    <span class="range-hint">取值范围2-60</span>
                                </div>
                            </div>
                            <div class="form-item">
                                <span class="form-label">最大重试次数</span>
                                <div class="form-control">
                                    <el-input-number v-model="healthCheckForm.maxRetries" :min="1" :max="10"
                                        controls-position="right" class="retries-input" />
                                    <span class="range-hint">取值范围1-10</span>
                                </div>
                            </div>
                            <div v-if="healthCheckForm.protocol === 'http' || healthCheckForm.protocol === 'https'"
                                class="form-item">
                                <span class="form-label">检查路径</span>
                                <div class="form-control">
                                    <el-input v-model="healthCheckForm.path" placeholder="/health" class="path-input" />
                                </div>
                            </div>
                            <div v-if="healthCheckForm.protocol === 'http' || healthCheckForm.protocol === 'https'"
                                class="form-item">
                                <span class="form-label">期望状态码</span>
                                <div class="form-control">
                                    <el-input v-model="healthCheckForm.expectedCode" placeholder="200"
                                        class="status-code-input" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 服务器组表单数据
const serverGroupForm = reactive({
    name: '',
    description: '',
    protocol: 'tcp',
    sessionPersistence: false,
    sessionType: 'source_ip',
    sessionTimeout: 1800,
    algorithm: 'round_robin'
})

// 健康检查表单数据
const healthCheckForm = reactive({
    enabled: true,
    protocol: 'tcp',
    interval: 5,
    timeout: 2,
    maxRetries: 2,
    path: '/health',
    expectedCode: '200'
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

// 模拟服务器数据
const allServers = ref([
    {
        id: 1,
        name: 'scseagent-vm1',
        type: '实例主机',
        ip: '10.42.253.90',
        spec: '2核4G',
        state: '运行中',
        port: 80,
        weight: 50
    },
    {
        id: 2,
        name: 'scseagent-vm2',
        type: '实例主机',
        ip: '10.42.253.91',
        spec: '2核4G',
        state: '运行中',
        port: 80,
        weight: 50
    },
    {
        id: 3,
        name: 'cgseagent-vm1',
        type: '实例主机',
        ip: '10.42.253.92',
        spec: '4核8G',
        state: '运行中',
        port: 80,
        weight: 50
    },
    {
        id: 4,
        name: 'cgseagent-vm2',
        type: '实例主机',
        ip: '10.42.253.93',
        spec: '4核8G',
        state: '运行中',
        port: 80,
        weight: 50
    },
    {
        id: 5,
        name: 'redis-vm1',
        type: '缓存服务器',
        ip: '10.42.253.94',
        spec: '2核4G',
        state: '运行中',
        port: 6379,
        weight: 50
    },
    {
        id: 6,
        name: 'mysql-vm1',
        type: '数据库服务器',
        ip: '10.42.253.95',
        spec: '4核8G',
        state: '运行中',
        port: 3306,
        weight: 50
    },
    {
        id: 7,
        name: 'nginx-vm1',
        type: '负载均衡器',
        ip: '10.42.253.96',
        spec: '2核4G',
        state: '运行中',
        port: 80,
        weight: 50
    },
    {
        id: 8,
        name: 'app-vm1',
        type: '应用服务器',
        ip: '10.42.253.97',
        spec: '4核8G',
        state: '运行中',
        port: 8080,
        weight: 50
    },
    {
        id: 9,
        name: 'app-vm2',
        type: '应用服务器',
        ip: '10.42.253.98',
        spec: '4核8G',
        state: '运行中',
        port: 8080,
        weight: 50
    },
    {
        id: 10,
        name: 'app-vm3',
        type: '应用服务器',
        ip: '10.42.253.99',
        spec: '4核8G',
        state: '运行中',
        port: 8080,
        weight: 50
    }
])

// 左侧数据（所有服务器）
const leftData = ref([...allServers.value])
// 右侧数据（已选服务器）
const rightData = ref([])

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

// 查询
const handleSearch = () => {
    leftCurrentPage.value = 1
    ElMessage.info(`查询到${filteredLeftData.value.length}条记录`)
}

// 重置
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
        // 检查服务器是否已经在右侧列表中
        const exists = rightData.value.some(rightServer => rightServer.id === server.id)
        if (!exists) {
            // 深拷贝服务器对象，避免引用问题
            const serverCopy = JSON.parse(JSON.stringify(server))
            rightData.value.push(serverCopy)
            addedCount++
        }
    })

    // 从左侧移除已选择的服务器
    leftData.value = leftData.value.filter(server =>
        !leftSelected.value.some(selected => selected.id === server.id)
    )

    // 清空左侧选择状态
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

    // 从右侧移除已选择的服务器
    rightData.value = rightData.value.filter(server =>
        !rightSelected.value.some(selected => selected.id === server.id)
    )

    // 将移除的服务器添加回左侧
    leftData.value.push(...rightSelected.value)

    const removedCount = rightSelected.value.length
    // 清空右侧选择状态
    rightSelected.value = []
    rightCurrentPage.value = 1

    ElMessage.success(`成功移除${removedCount}台服务器`)
}

// 添加相同主机（复制功能）
const addDuplicateServer = (server) => {
    // 深拷贝服务器对象
    const newServer = JSON.parse(JSON.stringify(server))

    // 生成新的ID避免重复
    newServer.id = Date.now() + Math.floor(Math.random() * 1000)

    // 修改名称，添加副本标识
    newServer.name = `${server.name}-副本`

    // 添加到右侧列表
    rightData.value.push(newServer)

    ElMessage.success(`已添加一台相同配置的主机: ${newServer.name}`)
}

// 删除服务器
const removeServer = (server) => {
    const index = rightData.value.findIndex(s => s.id === server.id)
    if (index !== -1) {
        rightData.value.splice(index, 1)
        // 将服务器添加回左侧
        leftData.value.push(server)
        ElMessage.success('服务器已移除')
    }
}

// 提交表单
const handleSubmit = () => {
    // 表单验证
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

    // 准备提交数据
    const submitData = {
        serverGroup: {
            ...serverGroupForm,
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

    // 在控制台打印数据
    console.log('提交的后端服务器组数据:', JSON.stringify(submitData, null, 2))

    // 显示成功消息
    ElMessage.success('后端服务器组创建成功！')

    // 这里可以添加实际的API调用
    // await api.createBackendServerGroup(submitData)
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
                type: 'warning'
            }
        )

        // 返回上一页或执行其他取消操作
        ElMessage.info('已取消创建')
        // 这里可以添加页面跳转逻辑
        // router.back()
    } catch (error) {
        // 用户取消操作
        console.log('用户取消了取消操作')
    }
}

// 初始化
onMounted(() => {
    // 设置默认值
    if (!serverGroupForm.algorithm) {
        serverGroupForm.algorithm = 'round_robin'
    }

    if (healthCheckForm.enabled === undefined) {
        healthCheckForm.enabled = true
    }
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
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
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
    margin-top: 8px;
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
</style>