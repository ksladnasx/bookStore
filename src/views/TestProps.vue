<template>
  <el-form ref="formRef" :model="form" label-width="auto">
    <el-form-item label="Name" prop="newName" label-position="left">
      <el-input v-model="form.newName" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="Email" prop="newEmail" label-position="left">
      <el-input v-model="form.newEmail" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="Age" prop="newAge" label-position="left">
      <el-input v-model="form.newAge" placeholder="请输入" />
    </el-form-item>
    <el-form-item ><el-button type="primary"
        @click="updateName(form.newName); updateEmail(form.newEmail); updateAge(form.newAge)">提交</el-button></el-form-item>
  </el-form>
  <el-divider />
  <el-form ref="formRef" :model="moreinfo" label-width="auto">
    <el-form-item label="Address"><el-input v-model="moreinfo.address" placeholder="请输入" /></el-form-item>
    <el-form-item label="Phone"><el-input v-model="moreinfo.phone" placeholder="请输入" /></el-form-item>
    <!-- <el-form-item><el-button type="primary"
      @click="emit('update:moreinfo',moreinfo)">提交</el-button>
    </el-form-item> -->
  </el-form>

</template>

<script setup lang='ts'>
import { reactive } from 'vue';

const form = reactive({
  newName: '',
  newEmail: '',
  newAge: 0
});
// 1. 定义接收的 props
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: 0
  },
  moreinfo: {
    type: Object,
    default: () => ({
      address: '',
      phone: ''
    })
  }
})
// 2. 声明对应的更新事件
const emit = defineEmits(['update:name', 'update:email', 'update:age', 'update:moreinfo'])

const updateName = (newName: string) => { emit('update:name', newName) }
const updateEmail = (newEmail: string) => { emit('update:email', newEmail); console.log("更新了：", newEmail) }
const updateAge = (newAge: number) => { emit('update:age', newAge) }

</script>

<style scoped></style>