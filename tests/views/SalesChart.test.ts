// tests/SalesChart.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SalesChart from "../../src/views/SalesChart.vue";

// 目的：为 SalesChart 提供稳定、可控的单元测试环境。
// 关键点：
// - 完整 mock echarts.init 返回的实例（setOption/resize/dispose 等方法）
// - 在 beforeEach 中重置所有 mock 并为 echarts.init 明确返回 mock 实例
// - 在组件内部使用 setTimeout(..., 0) 初始化图表时，使用微任务等待（setTimeout 0）保证 init 被调用

// 完整模拟 echarts 模块，init 返回一个对象（chart 实例）
vi.mock("echarts", () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

describe("SalesChart.vue - 基础测试", () => {
  let wrapper: any;
  let mockChartInstance: any;

  // 每个测试前准备环境：清理 mock、创建 mockChartInstance、挂载组件
  beforeEach(async () => {
    vi.clearAllMocks();

    // 导入 echarts 并获取 mock 引用
    const echarts = await import("echarts");

    // 新建一个更容易断言的 mock 实例并让 echarts.init 返回它
    mockChartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    // 告诉 mocked init 返回我们创建的实例
    vi.mocked(echarts.init).mockReturnValue(mockChartInstance as any);

    // 挂载组件，组件在 onMounted 中使用 setTimeout(..., 0) 初始化图表
    wrapper = mount(SalesChart as any);

    // 等待微任务/宏任务队列执行完（组件使用 setTimeout(..., 0)）, 这里等待 0ms 即可
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  afterEach(() => {
    // 卸载组件并清理引用
    if (wrapper) {
      wrapper.unmount();
    }
    mockChartInstance = null;
  });

  it("应该正确渲染出图表容器和标题", () => {
    // 验证基本 DOM 结构
    expect(wrapper.find(".chart-container").exists()).toBe(true);
    expect(wrapper.find("h2").text()).toBe("销售数据统计");
    expect(wrapper.find(".chart").exists()).toBe(true);
  });

  it("使用默认数据时应初始化图表并设置初始 option", async () => {
    const echarts = await import("echarts");

    // echarts.init 应被调用一次以创建图表实例 
    expect(echarts.init).toHaveBeenCalledTimes(1);

    // 初始化时组件会调用一次 setOption 设置初始配置
    expect(mockChartInstance.setOption).toHaveBeenCalledTimes(1);

    // 验证 setOption 的参数包含 series 并且 series[0].data 等于组件 props 的默认数据
    const calledWith = mockChartInstance.setOption.mock.calls[0][0];
    expect(calledWith).toHaveProperty("series");
    expect(calledWith.series[0]).toHaveProperty("data");
    expect(Array.isArray(calledWith.series[0].data)).toBe(true);
  });

  it("当 chartData 属性变化时应调用 setOption 更新数据", async () => {
    // 清理之前的调用计数
    mockChartInstance.setOption.mockClear();

    // 更新 props，触发 watch 回调
    await wrapper.setProps({ chartData: [20, 25, 30] });

    // watch 触发后应至少调用一次 setOption 更新 series 数据
    expect(mockChartInstance.setOption).toHaveBeenCalled();

    // 获取最近一次调用参数，确认数据正确更新
    const lastCallArg = mockChartInstance.setOption.mock.calls.slice(-1)[0][0];
    expect(lastCallArg).toHaveProperty("series");
    expect(lastCallArg.series[0]).toHaveProperty("data");
    expect(lastCallArg.series[0].data).toEqual([20, 25, 30]);
  });
  it("",()=>{
    mockChartInstance.setOption.mockClear()
  })
}); 
