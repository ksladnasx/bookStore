<template>
  <div class="health-check-config">
    <div class="config-container">
      <!-- 健康检查标题 -->
      <div class="section-header">
        <h3 class="section-title">健康检查</h3>
      </div>

      <div class="form-content">
        <!-- 是否开启 -->
        <div class="form-item">
          <span class="form-label">是否开启</span>
          <div class="form-control">
            <el-switch
              v-model="form.enabled"
              :active-value="true"
              :inactive-value="false"
            />
          </div>
        </div>

        <!-- 健康检查协议 -->
        <div class="form-item">
          <span class="form-label">健康检查协议</span>
          <div class="form-control">
            <el-select
              v-model="form.protocol"
              placeholder="请选择"
              class="protocol-select"
              disabled
            >
              <el-option label="TCP" value="tcp" />
              <el-option label="HTTP" value="http" />
              <el-option label="HTTPS" value="https" />
            </el-select>
          </div>
        </div>

        <!-- 检查间隔（秒） -->
        <div class="form-item">
          <span class="form-label">检查间隔（秒）</span>
          <div class="form-control">
            <el-input-number
              v-model="form.interval"
              :min="1"
              :max="20940"
              :step="1"
              controls-position="right"
              class="interval-input"
            />
            <span class="range-hint">取值范围1-20940</span>
          </div>
        </div>

        <!-- 超时时间（秒） -->
        <div class="form-item">
          <span class="form-label">超时时间（秒）</span>
          <div class="form-control">
            <el-input-number
              v-model="form.timeout"
              :min="2"
              :max="60"
              :step="1"
              controls-position="right"
              class="timeout-input"
            />
            <span class="range-hint">取值范围2-60</span>
          </div>
        </div>

        <!-- 最大重试次数 -->
        <div class="form-item">
          <span class="form-label">最大重试次数</span>
          <div class="form-control">
            <el-input-number
              v-model="form.maxRetries"
              :min="1"
              :max="10"
              :step="1"
              controls-position="right"
              class="retries-input"
            />
            <span class="range-hint">取值范围1-10</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

// 初始化表单数据
onMounted(() => {
  // 设置默认值
  if (props.form.enabled === undefined) {
    props.form.enabled = true
  }
  if (!props.form.protocol) {
    props.form.protocol = 'tcp'
  }
  if (!props.form.interval) {
    props.form.interval = 5
  }
  if (!props.form.timeout) {
    props.form.timeout = 2
  }
  if (!props.form.maxRetries) {
    props.form.maxRetries = 2
  }
})
</script>

<style scoped>
.health-check-config {
  width: 100%;
  padding: 0 20px;
}

.config-container {
  width: 100%;
  max-width: 800px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  text-align: left;
  margin: 0;
}

.form-content {
  width: 100%;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.form-label {
  width: 120px;
  font-weight: 500;
  color: #606266;
  text-align: left;
  padding-right: 20px;
  flex-shrink: 0;
}

.form-control {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.protocol-select {
  width: 200px;
}

.interval-input,
.timeout-input,
.retries-input {
  width: 120px;
}

.range-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
  white-space: nowrap;
}

/* 确保所有元素左对齐 */
:deep(.el-input-number) {
  text-align: left;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

:deep(.el-select) {
  width: 100%;
  text-align: left;
}

:deep(.el-switch) {
  align-items: center;
}

/* 调整数字输入框的加减按钮样式 */
:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  color: #606266;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: #409eff;
}

/* 确保标签和控件垂直居中对齐 */
.form-item {
  align-items: center;
  min-height: 40px;
}

/* 响应式调整 */
@media (max-width: 768px) {
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
}
</style>
