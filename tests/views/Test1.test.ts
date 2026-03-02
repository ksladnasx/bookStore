// MyDevicesPage.spec.ts
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { ElMessage, ElMessageBox } from 'element-plus'
import MyDevicesPage from '../../src/views/Tests1.vue' // 请根据实际路径调整

// 定义设备接口
interface Device {
  id: number
  name: string
  uuid: string
  lastLoginTime: string
  bindTime: string
}

// 修正element-plus模拟
vi.mock('element-plus', async () => {
  const actual = await vi.importActual<typeof import('element-plus')>('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn() as Mock
    }
  }
})

describe('MyDevicesPage 组件', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(MyDevicesPage)
  })

  it('组件挂载时应该获取并显示设备列表', async () => {
    // 等待组件挂载和异步操作完成
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 60))
    
    // 验证设备列表是否正确渲染
    const deviceCards = wrapper.findAll('.device-card')
    expect(deviceCards).toHaveLength(2) // 应该显示2个设备
    
    // 验证设备数据是否正确显示
    const firstDeviceName = wrapper.find('.device-name').text()
    expect(firstDeviceName).toBe('设备一')
  })

  describe('删除设备功能', () => {
    it('当用户确认删除时，应该调用删除API并更新设备列表', async () => {
      // 模拟用户确认
      ;(ElMessageBox.confirm as Mock).mockResolvedValueOnce(undefined)

      const initialDeviceCount = wrapper.vm.deviceList.length
      const deleteButton = wrapper.findAll('.delete-btn')[0]
      
      await deleteButton.trigger('click')
      
      // 等待确认对话框处理
      await wrapper.vm.$nextTick()
      
      // 等待API调用完成[5](@ref)
      await flushPromises()
      await new Promise(resolve => setTimeout(resolve, 60)) // 等待setTimeout完成
      
      // 检查设备列表是否更新
      expect(wrapper.vm.deviceList).toHaveLength(initialDeviceCount - 1)
      expect(wrapper.vm.deviceList.find((d: Device) => d.id === 1)).toBeUndefined()
      expect(ElMessage.success).toHaveBeenCalledWith('设备删除成功')
    })

    it('当用户取消删除时，应该显示提示信息', async () => {
      ;(ElMessageBox.confirm as Mock).mockRejectedValueOnce(undefined)

      const deleteButton = wrapper.findAll('.delete-btn')[0]
      await deleteButton.trigger('click')
      
      // 等待异步操作
      await wrapper.vm.$nextTick()
      
      expect(ElMessage.info).toHaveBeenCalledWith('已取消删除')
    })
  })

  describe.todo("取消删除功能",()=>{

  })
})