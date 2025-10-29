<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../stores/theme'
import users from '../mockData/users'

const router = useRouter()
const { t } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.isdark)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: t('register.username_required'), trigger: 'blur' },
    { min: 3, message: t('register.username_min'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('register.password_required'), trigger: 'blur' },
    { min: 6, message: t('register.password_min'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('register.confirm_required'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error(t('register.confirm_error')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const error = ref('')

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      // TODO: 调用注册接口
      setTimeout(() => {
        loading.value = false
        router.push('/login')
      }, 1000)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div class="register-container" :class="{ 'dark-mode': isDark }">
    <el-card class="register-card" :class="{ 'dark-mode': isDark }">
      <template #header>
        <div class="card-header" :class="{ 'dark-mode': isDark }">
          <h1 :class="{ 'dark-mode': isDark }">{{ t('register.title') }}</h1>
          <p :class="{ 'dark-mode': isDark }">{{ t('register.subtitle') }}</p>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="registerForm"
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
        <el-form-item :label="t('register.username')" prop="username">
          <el-input 
            v-model="registerForm.username" 
            :placeholder="t('register.username_placeholder')"
            :class="{ 'dark-mode': isDark }"
          />
        </el-form-item>
        <el-form-item :label="t('register.password')" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            :placeholder="t('register.password_placeholder')"
            show-password
            :class="{ 'dark-mode': isDark }"
          />
        </el-form-item>
        <el-form-item :label="t('register.confirm')" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            :placeholder="t('register.confirm_placeholder')"
            show-password
            :class="{ 'dark-mode': isDark }"
          />
        </el-form-item>
        <div class="form-actions">
          <el-button @click="()=>{router.back()}">{{ t('actions.back') }}</el-button>
          <el-button @click="resetForm(formRef)">{{ t('actions.reset') }}</el-button>
          <el-button 
            type="primary" 
            @click="submitForm(formRef)"
            :loading="loading"
          >
            {{ t('actions.register') }}
          </el-button>
        </div>
        <div class="tips"><span>{{ t('register.has_account') }}<el-link :icon="Edit" href="/login"><strong>{{ t('actions.login') }}</strong></el-link></span></div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.dark-mode {
  background-color: rgb(35, 39, 47) !important;
  color: #e0e0e0 !important;
}
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh ;
}

.register-card {
  width: 100%;
  max-width:400px;
  background: #fff;
  color: #303133;
  transition: background 0.3s, color 0.3s;
}
.register-card.dark-mode {
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
</style>