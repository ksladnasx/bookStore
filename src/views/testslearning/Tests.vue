<template>
  <h2>测试 Props 传值和事件更新</h2>
  <p>姓名: {{ userName }}</p>
  <p>邮箱: {{ userEmail }}</p>
  <p>年龄: {{ age }}</p>
  <p>地址：{{ Moreinfo.address }}</p>
  <p>电话：{{ Moreinfo.phone }}</p>
  <index v-if="step == 1" v-model:name="userName" v-model:email="userEmail" v-model:age="age" v-model:moreinfo="Moreinfo" />
  <ind v-if="step == 2" v-model:moreinfo="Moreinfo" />
  <el-button @click="step -= 1">上一步</el-button>
  <el-button @click="step += 1">下一步</el-button>
  <!-- <div class="update-btn">
    <button @click="updateData">更新数据</button>
  </div> -->
</template>
<script type="module" src="./usegetsign.ts"></script>
<!-- <script setup lang="ts">
// import { reactive, ref } from 'vue';
// import BarChart from './BarChart.vue';
// import SalesChart from './SalesChart.vue';
// import Tests1 from './Tests1.vue';
// import index from "./minitor/index.vue"
import ind from "../views/AddBackendServerGroup/AddBackendServerGroup.vue"
import { reactive, ref } from "vue";
import index from "./TestProps.vue"


const step = ref(1);
const userName = ref('');
const userEmail = ref('');
const age = ref(0);
const Moreinfo = reactive({
  address: '张三',
  phone: ''
})

// const font = reactive({
// color: 'rgba(0, 0, 0, .15)',
// })
// const salesData = ref([15, 24, 18, 32, 21, 28]);

// const updateData = () => {
//   salesData.value = salesData.value.map(() =>
//     Math.floor(Math.random() * 40) + 5
//   );
// };

</script> -->

<style>
.update-btn {
  padding-top: 20px;
}
</style>