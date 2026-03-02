<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../../stores/books'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const bookStore = useBookStore()
const { t } = useI18n()
const formRef = ref<FormInstance>()

const bookForm = reactive({
  title: '',
  author: '',
  isbn: '',
  publishYear: new Date().getFullYear(),
  category: '',
  description: '',
  coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600',
  quantity: 1
})

const categories = bookStore.categories

const rules = reactive<FormRules>({
  title: [
    { required: true, message: () => t('admin.bookTitleRequired'), trigger: 'blur' },
    { min: 2, message: () => t('admin.bookTitleMin'), trigger: 'blur' }
  ],
  author: [
    { required: true, message: () => t('admin.authorRequired'), trigger: 'blur' },
    { min: 2, message: () => t('admin.authorMin'), trigger: 'blur' }
  ],
  isbn: [
    { required: true, message: () => t('admin.isbnRequired'), trigger: 'blur' },
    { min: 10, message: () => t('admin.isbnMin'), trigger: 'blur' }
  ],
  publishYear: [
    { required: true, message: () => t('admin.publishYear'), trigger: 'blur' },
    { type: 'number', min: 1000, max: new Date().getFullYear(), message: () => t('admin.publishYearValid'), trigger: 'blur' }
  ],
  category: [
    { required: true, message: () => t('admin.categoryLabel'), trigger: 'change' }
  ],
  description: [
    { required: true, message: () => t('admin.descriptionRequired'), trigger: 'blur' },
    { min: 10, message: () => t('admin.descriptionMin'), trigger: 'blur' }
  ],
  coverImage: [
    { required: true, message: () => t('admin.coverImageRequired'), trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: () => t('admin.quantity'), trigger: 'blur' },
    { type: 'number', min: 1, message: () => t('admin.quantityMin'), trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) return
  try {
    await bookStore.addBook(bookForm)
    ElMessage.success(t('admin.addBookSuccess'))
    router.push('/admin/books')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : t('register.confirm_error'))
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleCancel = () => {
  router.push('/admin/books')
}
</script>

<template>
  <div class="add-book">
    <div class="form-header">
      <h2>{{ t('admin.addBookTitle') }}</h2>
    </div>
    
    <el-form
      ref="formRef"
      :model="bookForm"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="24">
        <el-col :span="24" :md="12">
          <el-form-item :label="t('admin.bookTitleLabel')" prop="title">
            <el-input v-model="bookForm.title" />
          </el-form-item>
          
          <el-form-item :label="t('admin.authorLabel')" prop="author">
            <el-input v-model="bookForm.author" />
          </el-form-item>
          
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item :label="t('admin.isbnLabel')" prop="isbn">
                <el-input v-model="bookForm.isbn" />
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item :label="t('admin.publishYear')" prop="publishYear">
                <el-input-number v-model="bookForm.publishYear" :min="1000" :max="new Date().getFullYear()" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item :label="t('admin.categoryLabel')" prop="category">
                <el-select v-model="bookForm.category" :placeholder="t('admin.selectCategory')" style="width: 100%">
                  <el-option
                    v-for="category in categories"
                    :key="category"
                    :label="category"
                    :value="category"
                  />
                  <el-option :label="t('admin.other')" value="Other" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item :label="t('admin.quantity')" prop="quantity">
                <el-input-number v-model="bookForm.quantity" :min="1" :precision="0" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item :label="t('admin.description')" prop="description">
            <el-input v-model="bookForm.description" type="textarea" :rows="4" />
          </el-form-item>
        </el-col>
        
        <el-col :span="24" :md="12">
          <el-form-item :label="t('admin.coverImageUrl')" prop="coverImage">
            <el-input v-model="bookForm.coverImage" />
          </el-form-item>
          
          <el-form-item :label="t('admin.preview')">
            <div class="cover-preview">
              <img 
                v-if="bookForm.coverImage" 
                :src="bookForm.coverImage" 
                alt="Book cover" 
                class="cover-image" 
              />
              <div v-else class="no-image">
                <el-icon><Picture /></el-icon>
                <span>{{ t('admin.noImage') }}</span>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div class="form-actions">
        <el-button @click="handleCancel">{{ t('button.cancel') }}</el-button>
        <el-button @click="resetForm(formRef)">{{ t('actions.reset') }}</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="bookStore.loading">
          {{ t('admin.addBookBtn') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.add-book {
  width: 100%;
}

.form-header {
  margin-bottom: 24px;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cover-preview {
  width: 100%;
  height: 300px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #909399;
}

.no-image .el-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
</style>