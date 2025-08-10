<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../stores/theme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.isdark)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: t('login.username_required'), trigger: 'blur' },
    { min: 3, message: t('login.username_min'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('login.password_required'), trigger: 'blur' },
    { min: 6, message: t('login.password_min'), trigger: 'blur' }
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
  <div class="login-container" :class="{ 'dark-mode': isDark }">
    <el-card class="login-card" :class="{ 'dark-mode': isDark }">
      <template #header>
        <div class="card-header" :class="{ 'dark-mode': isDark }">
          <h1 :class="{ 'dark-mode': isDark }">{{ t('login.title') }}</h1>
          <p :class="{ 'dark-mode': isDark }">{{ t('login.subtitle') }}</p>
        </div>
      </template>
      <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top" :class="{ 'dark-mode': isDark }">
        <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" style="margin-bottom: 20px" />
        <el-form-item :label="t('login.username')" prop="username">
          <el-input v-model="loginForm.username" :placeholder="t('login.username_placeholder')"
            :class="{ 'dark-mode': isDark }" />
        </el-form-item>
        <el-form-item :label="t('login.password')" prop="password">
          <el-input v-model="loginForm.password" type="password" :placeholder="t('login.password_placeholder')"
            show-password :class="{ 'dark-mode': isDark }" />
        </el-form-item>
        <div class="form-actions">
          <el-button @click="() => { router.back() }">{{ t('actions.back') }}</el-button>
          <el-button @click="resetForm(formRef)">{{ t('actions.reset') }}</el-button>
          <el-button type="primary" @click="submitForm(formRef)" :loading="loading">
            {{ t('actions.login') }}
          </el-button>
        </div>
        <div class="tips"><span>{{ t('login.no_account') }}<el-link :icon="Edit" href="/register"><strong>{{
          t('actions.register') }}</strong></el-link></span></div>

        <div class="login-info" :class="{ 'dark-mode': isDark }">
          <h3><strong>{{ t('login.test_account') }}</strong></h3>
          <div>
            <h5 style="padding-right: 32vh;"><strong>{{ t('login.admin') }}:</strong></h5>
            <div>
              username: <code>admin</code>
              password: <code>admin123</code>
            </div>
          </div>
          <div>
            <h5 style="padding-right: 30vh;"><strong>{{ t('login.user') }}:</strong></h5>
            <div>
              username: <code>user1</code>
              password: <code>user123</code>
            </div>
          </div>
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
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
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

.tips {
  text-align: right;
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
  transition: color 0.3s;
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