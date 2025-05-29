<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../../stores/books'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const formRef = ref<FormInstance>()

const bookId = computed(() => parseInt(route.params.id as string))
const loading = ref(true)

const bookForm = reactive({
  title: '',
  author: '',
  isbn: '',
  publishYear: new Date().getFullYear(),
  category: '',
  description: '',
  coverImage: '',
  quantity: 1
})

const categories = bookStore.categories

const rules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input book title', trigger: 'blur' },
    { min: 2, message: 'Title must be at least 2 characters', trigger: 'blur' }
  ],
  author: [
    { required: true, message: 'Please input author name', trigger: 'blur' },
    { min: 2, message: 'Author must be at least 2 characters', trigger: 'blur' }
  ],
  isbn: [
    { required: true, message: 'Please input ISBN', trigger: 'blur' },
    { min: 10, message: 'ISBN must be at least 10 characters', trigger: 'blur' }
  ],
  publishYear: [
    { required: true, message: 'Please input publish year', trigger: 'blur' },
    { 
      type: 'number', 
      min: 1000, 
      max: new Date().getFullYear(), 
      message: 'Please enter a valid year', 
      trigger: 'blur' 
    }
  ],
  category: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ],
  description: [
    { required: true, message: 'Please input description', trigger: 'blur' },
    { min: 10, message: 'Description must be at least 10 characters', trigger: 'blur' }
  ],
  coverImage: [
    { required: true, message: 'Please input cover image URL', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: 'Please input quantity', trigger: 'blur' },
    { 
      type: 'number', 
      min: 1, 
      message: 'Quantity must be at least 1', 
      trigger: 'blur' 
    }
  ]
})

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    const book = bookStore.getBookById(bookId.value)
    
    if (book) {
      Object.assign(bookForm, {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishYear: book.publishYear,
        category: book.category,
        description: book.description,
        coverImage: book.coverImage,
        quantity: book.quantity
      })
      loading.value = false
    } else {
      ElMessage.error('Book not found')
      router.push('/admin/books')
    }
  }, 800)
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      bookStore.updateBook(bookId.value, bookForm)
      ElMessage.success('Book updated successfully')
      router.push('/admin/books')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  const book = bookStore.getBookById(bookId.value)
  
  if (book) {
    Object.assign(bookForm, {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishYear: book.publishYear,
      category: book.category,
      description: book.description,
      coverImage: book.coverImage,
      quantity: book.quantity
    })
  }
}

const handleCancel = () => {
  router.push('/admin/books')
}
</script>

<template>
  <div class="edit-book">
    <div class="form-header">
      <h2>Edit Book</h2>
    </div>
    
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="p" style="width: 50%" />
          
          <div style="display: flex; gap: 12px; margin-top: 20px">
            <div style="flex: 1">
              <el-skeleton-item variant="text" style="margin-bottom: 10px" />
              <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 20px" />
              
              <el-skeleton-item variant="text" style="margin-bottom: 10px" />
              <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 20px" />
              
              <el-skeleton-item variant="text" style="margin-bottom: 10px" />
              <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 20px" />
            </div>
            
            <div style="flex: 1">
              <el-skeleton-item variant="text" style="margin-bottom: 10px" />
              <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 20px" />
              
              <el-skeleton-item variant="p" style="width: 100%; height: 300px" />
            </div>
          </div>
        </div>
      </template>
      
      <template #default>
        <el-form
          ref="formRef"
          :model="bookForm"
          :rules="rules"
          label-position="top"
        >
          <el-row :gutter="24">
            <el-col :span="24" :md="12">
              <el-form-item label="Title" prop="title">
                <el-input v-model="bookForm.title" />
              </el-form-item>
              
              <el-form-item label="Author" prop="author">
                <el-input v-model="bookForm.author" />
              </el-form-item>
              
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="ISBN" prop="isbn">
                    <el-input v-model="bookForm.isbn" />
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="Publish Year" prop="publishYear">
                    <el-input-number v-model="bookForm.publishYear" :min="1000" :max="new Date().getFullYear()" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="Category" prop="category">
                    <el-select v-model="bookForm.category" placeholder="Select category" style="width: 100%">
                      <el-option
                        v-for="category in categories"
                        :key="category"
                        :label="category"
                        :value="category"
                      />
                      <el-option label="Other" value="Other" />
                    </el-select>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="Quantity" prop="quantity">
                    <el-input-number v-model="bookForm.quantity" :min="1" :precision="0" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="Description" prop="description">
                <el-input v-model="bookForm.description" type="textarea" :rows="4" />
              </el-form-item>
            </el-col>
            
            <el-col :span="24" :md="12">
              <el-form-item label="Cover Image URL" prop="coverImage">
                <el-input v-model="bookForm.coverImage" />
              </el-form-item>
              
              <el-form-item label="Preview">
                <div class="cover-preview">
                  <img 
                    v-if="bookForm.coverImage" 
                    :src="bookForm.coverImage" 
                    alt="Book cover preview" 
                    class="cover-image" 
                  />
                  <div v-else class="no-image">
                    <el-icon><Picture /></el-icon>
                    <span>No image URL provided</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          
          <div class="form-actions">
            <el-button @click="handleCancel">Cancel</el-button>
            <el-button @click="resetForm(formRef)">Reset</el-button>
            <el-button type="primary" @click="submitForm(formRef)" :loading="bookStore.loading">
              Update Book
            </el-button>
          </div>
        </el-form>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.edit-book {
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