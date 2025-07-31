<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})

const formRef = ref<FormInstance>()
const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      authStore.login(loginForm)
      
      // Add a watcher to redirect after successful login
      const unwatch = authStore.$subscribe((mutation, state) => {
        if (state.currentUser && !state.loading) {
          unwatch()
          const redirectPath = route.query.redirect as string || '/'
          router.push(redirectPath)
        }
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
import { useTheme } from '../stores/theme';

const theme = useTheme();
const isDark = computed(() => theme.isdark);
</script>

<template>
  <div class="login-container" :class="{ 'dark-mode': isDark }">
    <el-card class="login-card" :class="{ 'dark-mode': isDark }">
      <template #header>
        <div class="card-header" :class="{ 'dark-mode': isDark }">
          <h1 :class="{ 'dark-mode': isDark }">登录</h1>
          <p :class="{ 'dark-mode': isDark }">请输入账号密码来进行个性化您的图书借阅</p>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        :class="{ 'dark-mode': isDark }"
      >
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-form-item label="Username" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="Enter your username"
            :class="{ 'dark-mode': isDark }"
          />
        </el-form-item>
        
        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            show-password
            :class="{ 'dark-mode': isDark }"
          />
        </el-form-item>
        
        <div class="form-actions">
          <el-button @click="()=>{router.back()}">返回</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
          <el-button 
            type="primary" 
            @click="submitForm(formRef)"
            :loading="loading"
          >
            登录
          </el-button>
        </div>
        
        <div class="login-info" :class="{ 'dark-mode': isDark }">
          <p><strong>测试账户:</strong></p>
          <p>管理员: username: <code>admin</code> / password: <code>admin123</code></p>
          <p>普通用户: username: <code>user1</code> / password: <code>user123</code></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.dark-mode {
  background-color: rgb(35, 39, 47) !important;
  color: #e0e0e0 !important;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh ;
}

.login-card {
  width: 100%;
  max-width:400px;
  background: #fff;
  color: #303133;
  transition: background 0.3s, color 0.3s;
}
.login-card.dark-mode {
  background: #23272f !important;
  color: #e0e0e0 !important;
}

.card-header {
  text-align: center;
}

.card-header h1 {
  font-size: 1.8rem;
  color: #303133;
  margin-bottom: 8px;
  transition: color 0.3s;
}
.card-header.dark-mode h1 {
  color: #fff;
}

.card-header p {
  color: #606266;
  margin: 0;
  transition: color 0.3s;
}
.card-header.dark-mode p {
  color: #b0b0b0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.login-info {
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #303133;
  transition: background 0.3s, color 0.3s;
}
.login-info.dark-mode {
  background-color: #23272f !important;
  color: #e0e0e0 !important;
}

.login-info code {
  background-color: #e6e6e6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
.login-info.dark-mode code {
  background-color: #333a4d;
  color: #90caf9;
}
</style>