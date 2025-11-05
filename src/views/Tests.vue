<template>
  <el-watermark :font="font" :content="['Han Wang', 'Test Area']">
    <!-- <BarChart :chart-data="salesData" /> -->
    <!-- <SalesChart :chart-data="salesData" /> -->
    <Tests1 />
  </el-watermark>
  
  <div class="update-btn">
    <button @click="updateData">更新数据</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
// import BarChart from './BarChart.vue';
// import SalesChart from './SalesChart.vue';
import Tests1 from './Tests1.vue';

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const salesData = ref([15, 24, 18, 32, 21, 28]);

const updateData = () => {
  salesData.value = salesData.value.map(() =>
    Math.floor(Math.random() * 40) + 5
  );
};




</script>

<style>
.update-btn {
  padding-top: 20px;
}
</style>