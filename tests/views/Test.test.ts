// tests/SalesChart.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SalesChart from "../../src/views/SalesChart.vue";

// 完整模拟echarts模块
vi.mock("echarts", () => {
  return {
    init: vi.fn(() => ({
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    })),
  };
});

describe("SalesChart.vue - 基础测试", () => {
  let wrapper: any;
  let mockChartInstance: any;
//运用  beforeEach和 afterEach这两个生命周期钩子，这是保证测试独立性的关键
  beforeEach(async () => {
    // 在每个测试前重置所有mock，这是关键！清理所有模拟，确保测试间互不干扰
    vi.clearAllMocks();

    // 创建新的模拟实例（使用 vi.mock模拟 echarts库）
    const echarts = await import("echarts");
    mockChartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      // 添加其他可能用到的echarts方法
    };
    vi.mocked(echarts.init).mockReturnValue(mockChartInstance);

    //2. 挂载组件，获得操作和查询的入口，注意每次测试只挂载一次组件
    wrapper = mount(SalesChart);

    // 使用更可靠的等待方式
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    // 确保每次测试后清理
    if (wrapper) {
      wrapper.unmount();
    }
  });

// 断言撰写
  it("应该正确渲染出图表容器和标题", () => {
    expect(wrapper.find(".chart-container").exists()).toBe(true);
    expect(wrapper.find("h2").text()).toBe("销售数据统计");
    expect(wrapper.find(".chart").exists()).toBe(true);
  });

  it("使用默认数据时应该初始化图表", async () => {
    const echarts = await import("echarts");

    // 现在应该只被调用一次
    expect(echarts.init).toHaveBeenCalledTimes(1);
    expect(mockChartInstance.setOption).toHaveBeenCalledTimes(1);
  });

  // 测试组件的响应式更新
  it("当chartData属性变化时更新图表", async () => {
    // 重置调用计数，只计算更新时的调用
    mockChartInstance.setOption.mockClear();

    // 更新chartData属性,将其变为只有三个数据点的数组，是为了测试更新逻辑
    await wrapper.setProps({ chartData: [20, 25, 30] });
    //只调用一次
    expect(mockChartInstance.setOption).toHaveBeenCalledTimes(1);
    expect(mockChartInstance.setOption).toHaveBeenCalledWith({
      series: [{ data: [20, 25, 30] }],
    });
  });
});
