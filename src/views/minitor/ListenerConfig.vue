<template>
  <div class="listener-config">
    <!-- 配置信息部分 -->
    <div class="form-section">
      <div class="section-header">
        <span class="section-title">配置信息</span>
        <el-tooltip
          content="配置监听器的基本信息，包括名称、协议和端口"
          placement="top"
        >
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-form :model="form" label-width="100px">
        <el-form-item label="监听器名称">
          <el-input v-model="form.name" placeholder="请输入监听器名称" />
        </el-form-item>
        <el-form-item label="协议">
          <el-select v-model="form.protocol" placeholder="请选择">
            <el-option label="HTTP" value="http" />
            <el-option label="HTTPS" value="https" />
            <el-option label="TCP" value="tcp" />
          </el-select>
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 高级配置部分 -->
    <div class="form-section">
      <div class="section-header">
        <span class="section-title">高级配置</span>
      </div>
      <el-form :model="form" label-width="100px" >
        <el-form-item label="重定向">
          <el-switch v-model="form.redirect" />
        </el-form-item>
        <!-- 重定向提示文字 - 在重定向行下方，左对齐 -->
        <div class="redirect-tip">
          HTTP协议方可开启重定向，每个监听器只能重定向一次。
        </div>
        
        <!-- 访问控制 -->
        <el-form-item label="访问控制">
          <el-radio-group v-model="form.accessControl">
            <el-radio label="allowAll">允许所有IP</el-radio>
            <el-radio label="whitelist">白名单</el-radio>
            <el-radio label="blacklist">黑名单</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- IP地址组选择行 - 只在选择白名单或黑名单时显示 -->
        <el-form-item 
          v-if="showIPAddressGroup" 
          label="IP地址组"
          class="ip-address-group-item"
        >
          <div class="ip-group-selector">
            <el-select 
              v-model="form.selectedIPGroup" 
              placeholder="请选择IP地址组"
              style="width: 300px;"
            >
              <el-option 
                v-for="group in ipAddressGroups" 
                :key="group.id" 
                :label="group.name" 
                :value="group.id" 
              />
            </el-select>
            <el-link 
              type="primary" 
              :underline="false" 
              href="#" 
              class="view-ip-link"
              @click.prevent="handleViewIPGroup"
            >
              查看IP地址组
            </el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

// 是否显示IP地址组选择行
const showIPAddressGroup = computed(() => {
  return props.form.accessControl === 'whitelist' || props.form.accessControl === 'blacklist'
})

// IP地址组数据
const ipAddressGroups = ref([
  { id: 1, name: '内部服务器IP组' },
  { id: 2, name: '办公网络IP组' },
  { id: 3, name: 'VPN用户IP组' },
  { id: 4, name: '管理员IP组' }
])

// 查看IP地址组链接点击事件
const handleViewIPGroup = () => {
  // 空链接，不做任何操作
  console.log('点击了查看IP地址组链接')
}

// 初始化表单数据
onMounted(() => {
  // 确保表单有selectedIPGroup属性
  if (!props.form.hasOwnProperty('selectedIPGroup')) {
    props.form.selectedIPGroup = null
  }
  // 设置默认访问控制
  if (!props.form.accessControl) {
    props.form.accessControl = 'allowAll'
  }
})
</script>

<style scoped>
.listener-config {
  padding: 0 20px;  
  min-width: 100%
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin-right: 8px;
}

.help-icon {
  color: #409eff;
  cursor: help;
  font-size: 16px;
}

/* 重定向提示文字 - 在重定向行下方，左对齐 */
.redirect-tip {
  font-size: 12px;
  color: #909399;
  margin: 2px 0 16px 0;
  padding-left: 30px;
  line-height: 1.4;
  text-align: left;
}

.ip-group-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-ip-link {
  font-size: 14px;
  white-space: nowrap;
}

/* 调整IP地址组表单项的样式，使其与访问控制对齐 */
.ip-address-group-item {
  margin-top: 0;
  margin-bottom: 0;
}

.ip-address-group-item :deep(.el-form-item__label) {
  text-align: right;
  padding-right: 12px;
}

.ip-address-group-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

/* 调整表单项样式 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}
</style>