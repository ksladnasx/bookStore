<template>
    <div class="chart-container">
        <h2>销售数据统计</h2>
        <div ref="chartRef" class="chart"></div>
    </div>
</template>

<script setup lang="ts">
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

// 图表配置项
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
            type: 'shadow'
        },
        formatter: '{b}<br/>{a}: {c}件'
        // b对应 series配置项中的 name属性
        // c对应 对应 series.data中指定位置的具体数值
        // a对应 ​对应 xAxis.data中指定位置的数据，通常表示横轴的标签
    },
    legend: {
        data: ['销量'],
        left: 'right', //对齐方式
        top: '5%'  //离顶部的距离
    },
    // 配置ECharts图表的网格（grid）系统，决定了直角坐标系（例如常见的折线图、柱状图）的绘图区域在容器中的位置和大小
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
        // containLabel配置​​网格区域是否包含坐标轴的​​刻度标签
    },

    // 坐标轴配置
    xAxis: {
        type: 'category',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'], //横坐标配置
        axisLabel: {
            color: '#666'
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: '#666',
            formatter: '{value} 件'
        },
        // inverse:true
    },

    // 核心数据系列配置，其中 type: 'bar'指定为柱状图
    series: [
        {
            name: '销量',
            type: 'bar',
            data: props.chartData,
            itemStyle: {
                color: '#5470c6',
                borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: '#295cce'
                }
            },
            label: {
                show: true,
                position: 'top',
                color: '#333'
            }
        }
    ]
});

// 初始化图表
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