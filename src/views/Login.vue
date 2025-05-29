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
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h1>Log In</h1>
          <p>Enter your credentials to access your account</p>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
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
          />
        </el-form-item>
        
        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            show-password
          />
        </el-form-item>
        
        <div class="form-actions">
          <el-button @click="resetForm(formRef)">Reset</el-button>
          <el-button 
            type="primary" 
            @click="submitForm(formRef)"
            :loading="loading"
          >
            Log In
          </el-button>
        </div>
        
        <div class="login-info">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: username: <code>admin</code> / password: <code>admin123</code></p>
          <p>User: username: <code>user1</code> / password: <code>user123</code></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h1 {
  font-size: 1.8rem;
  color: #303133;
  margin-bottom: 8px;
}

.card-header p {
  color: #606266;
  margin: 0;
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
}

.login-info p {
  margin: 8px 0;
  font-size: 0.9rem;
}

code {
  background-color: #e6e6e6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style>