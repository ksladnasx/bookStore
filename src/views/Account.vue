<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../stores/theme'
import { User, Key, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.isdark)

const formRef = ref<FormInstance>()
const saving = ref(false)
const saveSuccess = ref(false)

const initialSnapshot = reactive({ name: '', email: '' })

const form = reactive({
  name: '',
  email: '',
  newPassword: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: () => t('account.name_required'), trigger: 'blur' },
    { min: 2, max: 32, message: () => t('account.name_length'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: () => t('account.email_required'), trigger: 'blur' },
    { type: 'email', message: () => t('account.email_invalid'), trigger: 'blur' }
  ],
  newPassword: [
    { min: 6, message: () => t('account.password_min'), trigger: 'blur' }
  ]
})

const username = computed(() => authStore.currentUser?.username ?? '')
const currentUser = computed(() => authStore.currentUser)
const roleLabel = computed(() =>
  authStore.currentUser?.role === 'admin' ? t('login.admin') : t('login.user')
)

function initForm() {
  if (authStore.currentUser) {
    form.name = authStore.currentUser.name
    form.email = authStore.currentUser.email
    form.newPassword = ''
    initialSnapshot.name = authStore.currentUser.name
    initialSnapshot.email = authStore.currentUser.email
  }
}

function hasChanges(): boolean {
  return (
    form.name !== initialSnapshot.name ||
    form.email !== initialSnapshot.email ||
    form.newPassword.trim() !== ''
  )
}

onMounted(() => {
  authStore.changeactiveIndex('5')
  initForm()
})

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (!hasChanges()) {
    ElMessageBox.alert(t('account.no_changes'), t('account.no_changes_title'), {
      confirmButtonText: t('button.confirm'),
      type: 'info'
    })
    return
  }
  saving.value = true
  saveSuccess.value = false
  const payload: { name: string; email: string; password?: string } = {
    name: form.name,
    email: form.email
  }
  if (form.newPassword.trim()) payload.password = form.newPassword
  const ok = await authStore.updateProfile(payload)
  saving.value = false
  if (ok) {
    saveSuccess.value = true
    initialSnapshot.name = form.name
    initialSnapshot.email = form.email
    form.newPassword = ''
    formRef.value?.clearValidate('newPassword')
    ElMessage.success(t('account.saved'))
    setTimeout(() => {
      saveSuccess.value = false
      authStore.changeactiveIndex('1')
      router.push('/')
    }, 800)
  }
}

function goBack() {
  authStore.changeactiveIndex('1')
  router.push('/')
}

function onReset() {
  initForm()
  form.newPassword = ''
  formRef.value?.clearValidate()
}
</script>

<template>
  <div class="account-page" :class="{ 'dark-mode': isDark }">
    <div class="account-content">
      <el-card class="account-card" :class="{ 'dark-mode': isDark }">
        <template #header>
          <div class="account-card-header">
            <h2 class="account-title">{{ t('account.title') }}</h2>
            <p class="account-subtitle">{{ t('account.subtitle') }}</p>
          </div>
        </template>

        <div class="account-profile">
          <el-avatar :size="56" class="account-avatar">
            {{ (currentUser?.name ?? 'U').charAt(0).toUpperCase() }}
          </el-avatar>
          <div class="account-meta">
            <span class="account-username">{{ username }}</span>
            <el-tag size="small" type="info" round>{{ roleLabel }}</el-tag>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="account-form"
          :class="{ 'dark-mode': isDark }"
        >
          <el-form-item :label="t('account.name')" prop="name">
            <el-input
              v-model="form.name"
              :placeholder="t('account.name_placeholder')"
              clearable
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item :label="t('account.email')" prop="email">
            <el-input
              v-model="form.email"
              :placeholder="t('account.email_placeholder')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="t('account.username')">
            <el-input :model-value="username" disabled />
          </el-form-item>
          <el-form-item :label="t('account.password_optional')" prop="newPassword">
            <el-input
              v-model="form.newPassword"
              type="password"
              :placeholder="t('account.password_placeholder')"
              show-password
              clearable
              :prefix-icon="Key"
            />
          </el-form-item>

          <el-alert
            v-if="saveSuccess"
            :title="t('account.saved')"
            type="success"
            show-icon
            :closable="false"
            class="save-alert"
          />

          <div class="form-actions">
            <el-button @click="goBack">{{ t('account.back') }}</el-button>
            <div class="form-actions-right">
              <el-button @click="onReset">{{ t('actions.reset') }}</el-button>
              <el-button type="primary" :loading="saving" @click="onSubmit">
                {{ t('account.save') }}
              </el-button>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.account-page {
  min-height: 60vh;
  padding: 24px 16px 48px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
}

.account-page.dark-mode {
  background: #121212;
  color: #e0e0e0;
}

.account-content {
  max-width: 480px;
  width: 100%;
}

.account-card {
  border-radius: 8px;
  overflow: visible;
}

.account-card.dark-mode {
  background: #23272f !important;
  border-color: #3a3a3c;
}

.account-card-header {
  text-align: center;
}

.account-title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
}

.account-page.dark-mode .account-title {
  color: #e0e0e0;
}

.account-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #606266;
}

.account-page.dark-mode .account-subtitle {
  color: #a3a6ad;
}

.account-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.account-page.dark-mode .account-profile {
  border-bottom-color: #3a3a3c;
}

.account-avatar {
  background: #409eff !important;
  color: #fff !important;
  font-size: 1.25rem;
  font-weight: 600;
}

.account-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.account-username {
  font-weight: 600;
  font-size: 1rem;
  color: #303133;
}

.account-page.dark-mode .account-username {
  color: #e0e0e0;
}

.account-form :deep(.el-form-item__label) {
  color: #606266;
}

.account-page.dark-mode .account-form :deep(.el-form-item__label) {
  color: #a3a6ad;
}

.account-form.dark-mode :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: #3a3a3c;
  box-shadow: none;
}

.account-form.dark-mode :deep(.el-input__wrapper:hover),
.account-form.dark-mode :deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.1);
}

.save-alert {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.form-actions-right {
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .account-page {
    padding: 16px 12px 32px;
  }
}
</style>
