<template>
  <div class="device-register-page">
    <el-card class="register-card">
      <h2 class="register-title">设备注册</h2>

      <el-form  :model="formData" :rules="formRules" label-width="80px" label-position="right">
        <!-- UUID字段 -->
        <el-form-item label="UUID：">
          <el-input v-model="formData.uuid" placeholder="设备唯一标识符" disabled />
          <div class="uuid-hint">设备唯一标识符，不可修改</div>
        </el-form-item>

        <!-- 设备类型字段 --> 
        <el-form-item label="设备类型:">
          <el-select v-model="formData.deviceType" placeholder="请选择设备类型">
            <el-option label="Windows PC" value="windows" />
            <el-option label="MacBook" value="mac" />
            <el-option label="Linux Server" value="linux" />
            <el-option label="Android Phone" value="android" />
            <el-option label="iOS Device" value="ios" />
            <el-option label="其他设备" value="other" />
          </el-select>
        </el-form-item>

        <!-- 负责人字段 -->
        <el-form-item label="负责人：">
          <el-input v-model="formData.manager" placeholder="请输入" />
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表单引用
// const registerFormRef = ref()

// 表单数据
const formData = ref({
  uuid: '550e8400-e29b-41d4-a716-446655440000', // 固定UUID
  deviceType: '',
  manager: ''
})

// 表单验证规则
const formRules = reactive({
  deviceType: [
    { required: true, message: '请选择设备类型', trigger: 'change' }
  ],
  manager: [
    { required: true, message: '请选择负责人', trigger: 'change' }
  ]
})

// 提交表单
const handleSubmit = async () => {
  // 验证表单
  try {
    // await formData.value.validate()

    // 验证通过，提交数据
    ElMessage.success('设备注册成功！')
    console.log('提交表单数据:', formData)

    // 在实际应用中，这里会调用API提交数据
    // 提交成功后可以重置表单
    handleReset()
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}

// 取消操作
const handleCancel = () => {
  ElMessageBox.confirm(
    '确定要取消设备注册吗？所有输入将丢失。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      handleReset()
      ElMessage.info('已取消设备注册')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 重置表单
const handleReset = () => {
  formData.value= {
    uuid: '550e8400-e29b-41d4-a716-446655440000', // 固定UUID
    deviceType: '',
    manager: ''
  }
}
</script>

<style scoped>
.device-register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: -20px;
  /* background-color: #f5f7fa; */
}

.register-card {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 30px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.uuid-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin: 32px 0 0 0;
}
</style>