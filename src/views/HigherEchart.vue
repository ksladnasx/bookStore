<template>
  <div class="chart-dashboard">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

// 按需引入必要的组件
import { DatasetComponent, TransformComponent } from 'echarts/components';
echarts.use([DatasetComponent, TransformComponent]);

const chartRef = ref(null);
let chartInstance = null;

// 模拟销售数据
const rawData = [
  ['Product', 'Sales', 'Profit', 'Month', 'Category'],
  ['Laptop', 12500, 3200, '2025-01', 'Electronics'],
  ['Phone', 8900, 2100, '2025-01', 'Electronics'],
  ['Tablet', 6700, 1500, '2025-01', 'Electronics'],
  ['Laptop', 14200, 3800, '2025-02', 'Electronics'],
  ['Phone', 10200, 2500, '2025-02', 'Electronics'],
  ['Tablet', 7200, 1700, '2025-02', 'Electronics'],
  ['Chair', 4500, 1200, '2025-01', 'Furniture'],
  ['Desk', 3800, 900, '2025-01', 'Furniture'],
  ['Chair', 5200, 1400, '2025-02', 'Furniture'],
  ['Desk', 4100, 1000, '2025-02', 'Furniture']
];

const chartOption = {
  title: {
    text: '销售数据仪表板',
    subtext: '使用 dataset 和 transform 进行数据处理',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  legend: {
    top: '10%'
  },
  dataset: [
    {
      // 原始数据集
      id: 'original',
      source: rawData
    },
    {
      // 转换1：筛选电子类产品并按销售额排序
      id: 'electronics_sorted',
      fromDatasetId: 'original',
      transform: [
        {
          type: 'filter',
          config: { dimension: 'Category', '=': 'Electronics' }
        },
        {
          type: 'sort',
          config: { dimension: 'Sales', order: 'desc' }
        }
      ]
    },
    {
      // 转换2：筛选家具类产品
      id: 'furniture',
      fromDatasetId: 'original',
      transform: {
        type: 'filter',
        config: { dimension: 'Category', '=': 'Furniture' }
      }
    },
    {
      // 转换3：按月份聚合销售额（高级统计）
      id: 'monthly_summary',
      fromDatasetId: 'original',
      transform: {
        type: 'aggregate',
        config: {
          groupBy: 'Month',
          operations: [
            { dimension: 'Sales', operator: 'sum' },
            { dimension: 'Profit', operator: 'sum' }
          ]
        }
      }
    }
  ],
  xAxis: [
    {
      type: 'category',
      gridIndex: 0
    },
    {
      type: 'category',
      gridIndex: 1
    }
  ],
  yAxis: [
    {
      type: 'value',
      gridIndex: 0,
      name: '销售额'
    },
    {
      type: 'value',
      gridIndex: 1,
      name: '销售额'
    }
  ],
  grid: [
    {
      top: '20%',
      height: '35%'
    },
    {
      top: '60%',
      height: '35%'
    }
  ],
  series: [
    {
      name: '电子产品销售额',
      type: 'bar',
      datasetIndex: 1, // 引用 electronics_sorted
      encode: {
        x: 'Product',
        y: 'Sales',
        tooltip: ['Product', 'Sales', 'Profit', 'Month']
      },
      xAxisIndex: 0,
      yAxisIndex: 0
    },
    {
      name: '家具销售额',
      type: 'bar',
      datasetIndex: 2, // 引用 furniture
      encode: {
        x: 'Product',
        y: 'Sales',
        tooltip: ['Product', 'Sales', 'Profit', 'Month']
      },
      xAxisIndex: 0,
      yAxisIndex: 0
    },
    {
      name: '月度汇总',
      type: 'line',
      datasetIndex: 3, // 引用 monthly_summary
      encode: {
        x: 'Month',
        y: 'sum(Sales)',
        tooltip: ['Month', 'sum(Sales)', 'sum(Profit)']
      },
      xAxisIndex: 1,
      yAxisIndex: 1,
      smooth: true,
      lineStyle: { width: 3 },
      symbolSize: 8
    }
  ],
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      bottom: '5%'
    }
  ]
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

// 更新图表
const updateChart = () => {
  if (!chartInstance) return;
  chartInstance.setOption(chartOption);
};

// 响应式调整
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

// 暴露方法用于父组件调用
defineExpose({
  updateData: (newData) => {
    if (chartInstance && newData) {
      chartOption.dataset[0].source = newData;
      updateChart();
    }
  }
});
</script>

<style scoped>
.chart-dashboard {
  width: 100%;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.chart-container {
  width: 100%;
  height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>