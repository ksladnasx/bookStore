<template>
  <div class="strategy-config">
    <div class="config-container">
      <!-- 后端服务器组名称 -->
      <div class="form-item">
        <span class="form-label">后端服务器组名称</span>
        <el-input v-model="serverGroupName" placeholder="" disabled class="input-field" />
      </div>

      <!-- 后端协议 -->
      <div class="form-item">
        <span class="form-label">后端协议</span>
        <el-input
         v-model="prots"
         placeholder=""
         disabled
         class="input-field" />
      </div>

      <!-- 获取客户端真实源IP -->
      <div class="form-item">
        <span class="form-label">获取客户端真实源IP</span>
        <div class="form-control">
          <el-switch v-model="form.getClientIP" :disabled="!form.acknowledgeRisk" />
          <div class="warning-text">
            注意：该功能不支持平滑开启，切换到ProxyProtocol需要业务停服升级，请谨慎配置。
          </div>
          <div class="checkbox-item">
            <el-checkbox v-model="form.acknowledgeRisk">确认知晓以上风险</el-checkbox>
          </div>
        </div>
      </div>

      <!-- 会话保持 -->
      <div class="form-item">
        <span class="form-label">会话保持</span>
        <div class="form-control">
          <el-switch v-model="form.sessionPersistence" />
        </div>
      </div>

      <!-- 分配策略类型 -->
      <div class="form-item">
        <span class="form-label required">分配策略类型</span>
        <div class="form-control">
          <el-select v-model="form.algorithm" placeholder="请选择" class="algorithm-select">
            <el-option v-for="algorithm in algorithms" :key="algorithm.value" :label="algorithm.label"
              :value="algorithm.value" />
          </el-select>
        </div>
      </div>

      <!-- 描述 -->
      <div class="form-item">
        <span class="form-label">描述</span>
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述信息" class="description-input"
          maxlength="200" show-word-limit />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  serverGroupName: {
    type: String,
    default: ''
  },
  protocol: {
    type: String,
    default: ''
  }
})
const formProtocolName = (protocol) => {
  const protocols = {
    'http': 'HTTP',
    'https': 'HTTPS',
    'tcp': 'TCP'
  }
  return protocols[protocol] || 'undefined'
}

// 服务器组名称（从父组件传入）
const serverGroupName = computed(() => props.serverGroupName)
const prot = computed(() => props.protocol)
const prots = formProtocolName(prot.value)
// 分配策略选项
const algorithms = ref([
  { label: '轮询算法', value: 'roundRobin' },
  { label: '带权重轮询算法', value: 'weightedRoundRobin' },
  { label: '最少连接算法', value: 'leastConnections' },
  { label: '源IP哈希算法', value: 'sourceIPHash' }
])

// 初始化表单数据
onMounted(() => {
  // 确保表单有所有必要的属性
  if (!props.form.hasOwnProperty('getClientIP')) {
    props.form.getClientIP = false
  }
  if (!props.form.hasOwnProperty('acknowledgeRisk')) {
    props.form.acknowledgeRisk = false
  }
  if (!props.form.hasOwnProperty('sessionPersistence')) {
    props.form.sessionPersistence = false
  }
  if (!props.form.hasOwnProperty('algorithm')) {
    props.form.algorithm = ''
  }
  if (!props.form.hasOwnProperty('description')) {
    props.form.description = ''
  }
  if (!props.form.hasOwnProperty('backendProtocol')) {
    props.form.backendProtocol = ''
  }
})
</script>

<style scoped>
.strategy-config {
  width: 100%;
  padding: 0 20px;
}

.config-container {
  width: 100%;
  max-width: 800px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  width: 100%;
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
  text-align: left;
}

.input-field {
  width: 300px;
}

.algorithm-select {
  width: 300px;
}

.description-input {
  width: 100%;
  max-width: 500px;
}

.warning-text {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 8px;
  line-height: 1.4;
  max-width: 500px;
}

.checkbox-item {
  margin-top: 8px;
}

/* 确保所有元素左对齐 */
:deep(.el-input__inner) {
  text-align: left;
}

:deep(.el-textarea__inner) {
  text-align: left;
  resize: vertical;
}

:deep(.el-select .el-input__inner) {
  text-align: left;
}

:deep(.el-switch) {
  align-items: center;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #606266;
}
</style>
