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
  await formRef.value.validate((valid) => {
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
    const ok = authStore.updateProfile(payload)
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
  })
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
    <div class="account-backdrop" aria-hidden="true" />
    <div class="account-content">
      <header class="account-header">
        <div class="account-header-top">
          <el-button class="back-btn" :icon="ArrowLeft" text @click="goBack">
            {{ t('account.back') }}
          </el-button>
        </div>
        <h1 class="account-title">{{ t('account.title') }}</h1>
        <p class="account-subtitle">{{ t('account.subtitle') }}</p>
      </header>

      <div class="account-card-wrap">
        <div class="account-card" :class="{ 'dark-mode': isDark }">
          <div class="account-card-head">
            <div class="avatar-wrap">
              <el-avatar :size="64" class="account-avatar">
                {{ (currentUser?.name ?? 'U').charAt(0).toUpperCase() }}
              </el-avatar>
            </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-page {
  --account-bg: linear-gradient(165deg, #f8f6f3 0%, #ebe8e4 50%, #e2ddd6 100%);
  --account-card-bg: #fff;
  --account-text: #2c2825;
  --account-muted: #6b6560;
  --account-accent: #b8860b;
  --account-accent-hover: #9a7209;
  --account-border: rgba(44, 40, 37, 0.08);
  --account-shadow: 0 4px 24px rgba(44, 40, 37, 0.06);
  --account-font-title: 'Georgia', 'Songti SC', serif;
  --account-font-body: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 60vh;
  position: relative;
  padding: 2rem 1rem 4rem;
  font-family: var(--account-font-body);
  color: var(--account-text);
  transition: background 0.3s, color 0.3s;
}

.account-page.dark-mode {
  --account-bg: linear-gradient(165deg, #1a1918 0%, #222120 50%, #252422 100%);
  --account-card-bg: #2c2a28;
  --account-text: #e8e6e3;
  --account-muted: #a39e97;
  --account-accent: #d4a84b;
  --account-accent-hover: #e8bc5c;
  --account-border: rgba(232, 230, 227, 0.08);
  --account-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.account-backdrop {
  position: absolute;
  inset: 0;
  background: var(--account-bg);
  z-index: 0;
}

.account-content {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  animation: accountReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes accountReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.account-header {
  text-align: center;
  margin-bottom: 2rem;
}

.account-header-top {
  text-align: left;
  margin-bottom: 1rem;
}

.back-btn {
  color: var(--account-muted);
  font-weight: 500;
}

.back-btn:hover {
  color: var(--account-accent);
}

.account-title {
  font-family: var(--account-font-title);
  font-size: 1.85rem;
  font-weight: 600;
  color: var(--account-text);
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
}

.account-subtitle {
  font-size: 0.95rem;
  color: var(--account-muted);
  margin: 0;
}

.account-card-wrap {
  animation: cardReveal 0.5s 0.12s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
  transform: translateY(16px);
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.account-card {
  background: var(--account-card-bg);
  border-radius: 16px;
  box-shadow: var(--account-shadow);
  border: 1px solid var(--account-border);
  overflow: hidden;
  padding: 1.75rem 1.5rem;
  transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
}

.account-card-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--account-border);
}

.avatar-wrap {
  flex-shrink: 0;
}

.account-avatar {
  background: var(--account-accent) !important;
  color: #fff !important;
  font-family: var(--account-font-title);
  font-size: 1.5rem;
  font-weight: 600;
}

.account-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.account-username {
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--account-text);
}

.account-form :deep(.el-form-item__label) {
  color: var(--account-muted);
  font-weight: 500;
}

.account-form.dark-mode :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: var(--account-border);
  box-shadow: none;
}

.account-form.dark-mode :deep(.el-input__wrapper:hover),
.account-form.dark-mode :deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.1);
}

.save-alert {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 1.5rem;
}

.form-actions-right {
  display: flex;
  gap: 12px;
}

.form-actions .el-button--primary {
  background: var(--account-accent);
  border-color: var(--account-accent);
}

.form-actions .el-button--primary:hover {
  background: var(--account-accent-hover);
  border-color: var(--account-accent-hover);
}

@media (max-width: 640px) {
  .account-page {
    padding: 1rem 0.75rem 3rem;
  }
  .account-title {
    font-size: 1.5rem;
  }
  .account-card {
    padding: 1.25rem 1rem;
  }
}
</style>
