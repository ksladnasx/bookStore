<template>
   <div class="chart-container">
        <h2>销售数据统计</h2>
        <div ref="chartRef" class="chart"></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

// 使用ref获取DOM元素
const chartRef = ref<HTMLDivElement>();
let myChart: ECharts | null = null;

// 定义props类型 
interface ChartProps {
    chartData: number[];
}

const props = withDefaults(defineProps<ChartProps>(), {
    chartData: () => [5, 20, 36, 10, 10, 20]
});


const getOption = (): EChartsOption => ({
    title: {
        text: '月度销售数据',
        left: 'left',
        textStyle: {
            color: '#333',
            fontSize: 16
        }
    },
    // 鼠标悬停提示框
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        formatter: '<strong>商品{b}</strong><br/>{a0}: {c0}件<br/>{a1}: {c1}件<br/>{a2}: {c2}件'
    },
    // 图例
    legend: {
        data: ['销量','买量','余量'],
        left: 'right', //对齐方式
        top: '5%'  //离顶部的距离
    },
    // 
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },

    // 坐标轴配置
    xAxis: {
    type: 'category',
    data: ['A', 'B', 'C','D','E','F'],
  },
  yAxis: {
    type:'value'
  },
  series: [
    {
      name: '销量',
      data: props.chartData,
      type: 'line',
      color:'red',
    },
    {
        name:'余量',
        data:[25, 20, 50, 30, 55, 10],
        type:"bar",
        color:'pink',
        barWidth:'50%'
    },
    {
        name:"买量",
        data:[23,12,63,32,52,33],
        type:'line'
    }
  ]
});

const initChart = () => {
    if (!chartRef.value) return;

    myChart = echarts.init(chartRef.value);
    myChart.setOption(getOption());
};
// 处理窗口 resize 事件
const handleResize = () => {
    myChart?.resize();
};

onMounted(() => {
    // 确保DOM已挂载后初始化图表
    setTimeout(() => {
        initChart();
        window.addEventListener('resize', handleResize);
    }, 0);
});


// 监听数据变化
watch(() => props.chartData, (newData) => {
    if (myChart) {
        myChart.setOption({
            series: [{
                data: newData
            }]
        });
    }
});

onUnmounted(() => {
    // 清理资源,销毁实例避免内存泄漏
    window.removeEventListener('resize', handleResize);
    myChart?.dispose();
});
</script>

<style scoped>
.chart-container {
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h2 {
    margin-bottom: 20px;
    text-align: center;
    color: #333;
}

.chart {
    width: 100%;
    height: 400px;
}
</style>