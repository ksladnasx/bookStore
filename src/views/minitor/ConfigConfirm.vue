<template>
    <div class="config-container">
      <!-- 配置确认标题 -->
      <div class="section-header">
        <h3 class="section-title">配置确认</h3>
      </div>

      <!-- 配置信息表格 -->
      <div class="confirm-table">
        <table class="confirm-table-inner">
          <thead>
            <tr>
              <th class="backend-col">后端服务器组配置</th>
              <th class="listener-col">监听器</th>
              <th class="strategy-col">分配策略</th>
              <th class="health-col">健康检查</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <!-- 后端服务器组配置列 -->
              <td class="backend-col">
                <div class="config-item">
                  <span class="item-label" >后端服务器组名称</span>
                  <span class="item-value">{{ serverGroupName || '未设置' }}</span>
                </div>
              </td>

              <!-- 监听器列 -->
              <td class="listener-col">
                <div class="config-item">
                  <span class="item-label">监听器名称</span>
                  <span class="item-value">{{ listenerConfig.name || 'listener-ow73r6' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">端口</span>
                  <span class="item-value">{{ listenerConfig.port || '80' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">协议</span>
                  <span class="item-value">{{ getProtocolName(listenerConfig.protocol) }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">获取客户端真实源IP</span>
                  <span class="item-value">{{ listenerConfig.getClientRealIP ? '是' : '否' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">访问控制</span>
                  <span class="item-value">{{ getAccessControlName(listenerConfig.accessControl) }}</span>
                </div>
              </td>

              <!-- 分配策略列 -->
              <td class="strategy-col">
                <div class="config-item">
                  <span class="item-label">后端协议</span>
                  <span class="item-value">{{ getAccessControlName(strategyConfig.backendProtocol) || 'TCP' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">获取客户端真实源IP</span>
                  <span class="item-value">{{ strategyConfig.getClientIP ? '是' : '否' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">分配策略类型</span>
                  <span class="item-value">{{ getAlgorithmName(strategyConfig.algorithm) }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">会话保持</span>
                  <span class="item-value">{{ strategyConfig.sessionPersistence ? '开启' : '关闭' }}</span>
                </div>
                <div class="config-item">
                  <span class="item-label">描述</span>
                  <span class="item-value">{{ strategyConfig.description || '无' }}</span>
                </div>
              </td>

              <!-- 健康检查列 -->
              <td class="health-col">
                <div class="config-item">
                  <span class="item-label">是否开启</span>
                  <span class="item-value">{{ healthCheckConfig.enabled ? '是' : '否' }}</span>
                </div>
                <div v-if="healthCheckConfig.enabled" class="config-item">
                  <span class="item-label">健康检查协议</span>
                  <span class="item-value">{{ getHealthProtocolName(healthCheckConfig.protocol) }}</span>
                </div>
                <div v-if="healthCheckConfig.enabled" class="config-item">
                  <span class="item-label">检查间隔(秒)</span>
                  <span class="item-value">{{ healthCheckConfig.interval || '5' }}</span>
                </div>
                <div v-if="healthCheckConfig.enabled" class="config-item">
                  <span class="item-label">超时时间(秒)</span>
                  <span class="item-value">{{ healthCheckConfig.timeout || '2' }}</span>
                </div>
                <div v-if="healthCheckConfig.enabled" class="config-item">
                  <span class="item-label">最大重试次数</span>
                  <span class="item-value">{{ healthCheckConfig.maxRetries || '2' }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 底部按钮 -->
      <div class="action-buttons">
        <el-button @click="handlePrevStep">上一步</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  listenerConfig: {
    type: Object,
    required: true,
    default: () => ({})
  },
  serverGroupName: {
    type: String,
    required: true,
    default: ''
  },
  strategyConfig: {
    type: Object,
    required: true,
    default: () => ({})
  },
  healthCheckConfig: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 明确定义emits
const emit = defineEmits(['prev-step', 'submit'])

// 处理上一步按钮点击
const handlePrevStep = () => {
  console.log('点击了上一步按钮')
  emit('prev-step')
}

// 处理提交按钮点击
const handleSubmit = () => {
  console.log('点击了提交按钮')
  emit('submit')
}

// 获取协议名称
const getProtocolName = (protocol) => {
  const protocols = {
    'http': 'HTTP',
    'https': 'HTTPS',
    'tcp': 'TCP'
  }
  return protocols[protocol] || 'TCP'
}

// 获取访问控制名称
const getAccessControlName = (accessControl) => {
  const controls = {
    'allowAll': '允许所有IP',
    'whitelist': '白名单',
    'blacklist': '黑名单'
  }
  return controls[accessControl] || '白名单'
}

// 获取算法名称
const getAlgorithmName = (algorithm) => {
  const algorithms = {
    'roundRobin': '轮询算法',
    'weightedRoundRobin': '带权重轮询算法',
    'leastConnections': '最少连接算法',
    'sourceIPHash': '源IP哈希算法'
  }
  return algorithms[algorithm] || '带权重轮询算法'
}

// 获取健康检查协议名称
const getHealthProtocolName = (protocol) => {
  const protocols = {
    'tcp': 'TCP',
    'http': 'HTTP',
    'https': 'HTTPS'
  }
  return protocols[protocol] || 'TCP'
}
</script>

<style scoped>

.config-container {
  min-width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;

}

.section-header {
  margin-bottom: 20px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

/* 配置确认表格样式 */
.confirm-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 24px;
  margin-left: 20px;
  margin-right: 20px;
  max-width: 100%;
  /* overflow: hidden; */
  background-color: #ffffff;
}

.confirm-table-inner {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.confirm-table-inner th {
  background-color: #f5f7fa;
  padding: 12px 16px;
  font-weight: 500;
  color: #606266;
  text-align: center;
  border: 1px solid #ebeef5;
  font-size: 14px;
}

.confirm-table-inner td {
  padding: 0;
  border: 1px solid #ebeef5;
  vertical-align: top;
  background-color: #ffffff;
}

/* 列宽分配 */
.backend-col {
  width: 20%;
}

.listener-col {
  width: 30%;
}

.strategy-col {
  width: 30%;
}

.health-col {
  width: 20%;
}

.config-item {
  display: flex;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  min-height: 40px;
  align-items: center;
}

.config-item:last-child {
  border-bottom: none;
}

.item-label {
  font-weight: 500;
  color: #606266;
  /* margin-right: 8px; */
  /* white-space: nowrap; */
  flex-shrink: 0;
  width: 120px;
  font-size: 16px;
}

.item-value {
  color: #303133;
  word-break: break-word;
  flex: 1;
  font-size: 14px;
}

/* 底部按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 按钮样式 */
:deep(.el-button) {
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button:not(.el-button--primary)) {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #606266;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

:deep(.el-button:not(.el-button--primary):hover) {
  border-color: #c6e2ff;
  color: #409eff;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .confirm-table {
    overflow-x: auto;
  }

  .confirm-table-inner {
    width: auto;
    min-width: 800px;
  }

  .config-container {
    padding: 15px;
  }

  .item-label {
    width: 120px;
  }
}
</style>
