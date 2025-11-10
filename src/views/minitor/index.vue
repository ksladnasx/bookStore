<template>
  <div class="load-balancer-config">
    <div class="config-container">
      <!-- 顶部流程步骤 -->
      <div class="steps-header">
        <el-steps :active="currentStep" align-center>
          <el-step title="配置监听器" />
          <el-step title="配置后端服务器组" />
          <el-step title="配置分配策略" />
          <el-step title="启用健康检查" />
          <el-step title="配置确认" />
        </el-steps>
      </div>

      <!-- 步骤内容区域 -->
      <div class="steps-content">
        <!-- 步骤1: 配置监听器 -->
        <ListenerConfig
          v-if="currentStep === 0"
          v-model:form="listenerForm"
        />

        <!-- 步骤2: 配置后端服务器组 -->
        <ServerGroupConfig
          v-if="currentStep === 1"
          v-model:selected-servers="selectedServerGroup"
          v-model:server-group-name="serverGroupName"
        />

        <!-- 步骤3: 配置分配策略 -->
        <StrategyConfig
          v-if="currentStep === 2"
          v-model:form="strategyForm"
          :server-group-name="serverGroupName"
        />

        <!-- 步骤4: 启用健康检查 -->
        <HealthCheckConfig
          v-if="currentStep === 3"
          v-model:form="healthCheckForm"
        />

        <!-- 步骤5: 配置确认 -->
        <ConfigConfirm
          v-if="currentStep === 4"
          :listener-config="listenerForm"
          :server-group-name="serverGroupName"
          :strategy-config="strategyForm"
          :health-check-config="healthCheckForm"
          @prev-step="prevStep"
          @submit="submitConfig"
        />
      </div>

      <!-- 底部按钮 - 只在非配置确认页面显示 -->
      <div v-if="currentStep !== 4" class="steps-footer">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button
          v-if="currentStep < 4"
          type="primary"
          @click="nextStep"
        >
          下一步
        </el-button>
        <el-button @click="cancelConfig">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ListenerConfig from './ListenerConfig.vue'
import ServerGroupConfig from './ServerGroupConfig.vue'
import StrategyConfig from './StrategyConfig.vue'
import HealthCheckConfig from './HealthCheckConfig.vue'
import ConfigConfirm from './ConfigConfirm.vue'

// 当前步骤
const currentStep = ref(0)

// 步骤1表单数据
const listenerForm = reactive({
  name: 'listener-ow73r6',
  protocol: '',
  port: 80,
  redirect: false,
  accessControl: 'allowAll',
  getClientRealIP: false
})

// 步骤2数据
const selectedServerGroup = ref([])
const serverGroupName = ref('')

// 步骤3表单数据
const strategyForm = reactive({
  groupName: '',
  backendProtocol: 'TCP',
  getClientIP: false,
  acknowledgeRisk: false,
  sessionPersistence: false,
  algorithm: '',
  description: ''
})

// 步骤4表单数据
const healthCheckForm = reactive({
  enabled: true,
  protocol: 'tcp',
  interval: 5,
  timeout: 2,
  maxRetries: 2
})

// 导航方法
const nextStep = () => {
  // 在进入下一步前进行验证
  if (!validateForm()) {
    return
  }

  if (currentStep.value < 4) {
    currentStep.value++
   // console.log('切换到步骤:', currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    // console.log('返回到步骤:', currentStep.value)
  }
}

const submitConfig = async () => {
  try {
    console.log('开始提交配置...')

    // 最终提交前的验证
    if (!validateForm()) {
      return
    }

    // 提交配置
    const configData = {
      listenerForm,
      serverGroupName: serverGroupName.value,
      selectedServerGroup: selectedServerGroup.value,
      strategyForm,
      healthCheckForm
    }

    console.log('提交配置数据:', configData)

    // 模拟API调用
    // await api.submitLoadBalancerConfig(configData)

    ElMessage.success('配置提交成功！')

    // 重置表单并返回第一步
    resetForm()
    currentStep.value = 0

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败：' + error.message)
  }
}

const cancelConfig = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要取消配置吗？所有未保存的更改将丢失。',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 重置表单
    resetForm()
    currentStep.value = 0
    ElMessage.info('配置已取消')
  } catch (error) {
    // 用户取消操作
    console.log('用户取消了取消操作')
  }
}

// 表单验证
const validateForm = () => {
  console.log('验证步骤:', currentStep.value)

  // 根据当前步骤进行验证
  switch (currentStep.value) {
    case 0:
      if (!listenerForm.name.trim()) {
        ElMessage.error('请输入监听器名称')
        return false
      }
      if (!listenerForm.protocol) {
        ElMessage.error('请选择协议')
        return false
      }
      break
    case 1:
      if (!serverGroupName.value.trim()) {
        ElMessage.error('请输入后端服务器组名称')
        return false
      }
      if (selectedServerGroup.value.length === 0) {
        ElMessage.error('请选择至少一个后端服务器')
        return false
      }
      break
    case 2:
      if (!strategyForm.algorithm) {
        ElMessage.error('请选择分配策略类型')
        return false
      }
      if (strategyForm.getClientIP && !strategyForm.acknowledgeRisk) {
        ElMessage.error('请确认知晓获取客户端真实IP的风险')
        return false
      }
      break
    case 4: // 配置确认页面的验证
      if (!serverGroupName.value.trim()) {
        ElMessage.error('后端服务器组名称不能为空')
        return false
      }
      if (selectedServerGroup.value.length === 0) {
        ElMessage.error('请至少选择一个后端服务器')
        return false
      }
      if (!strategyForm.algorithm) {
        ElMessage.error('请选择分配策略类型')
        return false
      }
      break
  }
  return true
}

// 重置表单
const resetForm = () => {
  Object.assign(listenerForm, {
    name: 'listener-ow73r6',
    protocol: '',
    port: 80,
    redirect: false,
    accessControl: 'allowAll',
    getClientRealIP: false
  })

  selectedServerGroup.value = []
  serverGroupName.value = ''

  Object.assign(strategyForm, {
    groupName: '',
    backendProtocol: 'TCP',
    getClientIP: false,
    acknowledgeRisk: false,
    sessionPersistence: false,
    algorithm: '',
    description: ''
  })

  Object.assign(healthCheckForm, {
    enabled: true,
    protocol: 'tcp',
    interval: 5,
    timeout: 2,
    maxRetries: 2
  })

  console.log('表单已重置')
}
</script>

<style scoped>
.load-balancer-config {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.config-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.steps-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.steps-content {
  padding: 30px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.steps-footer {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
