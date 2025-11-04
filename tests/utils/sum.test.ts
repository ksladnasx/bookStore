// tests/unit/math.test.ts
import { describe, it, expect } from 'vitest';
import { sum,multiply ,divide,subtract} from '../../src/utils/sum';

describe('数学工具函数', () => {
  describe('sum 函数', () => {
    it('应该能正确计算两个数字的和', () => {
      // 准备数据 (Arrange)
      const a = 1;
      const b = 3;
      
      // 执行函数 (Act)
      const result = sum(a, b);
      
      // 验证结果 (Assert)
      expect(result).toBe(4);
    });
    
    it('应该能处理负数', () => {
      expect(sum(-1, 5)).toBe(4);
    });
  });

  describe('multiply函数',() => {
    it('能正确执行乘法',()=>{
      expect(multiply(2,3)).toBe(6)
    });
    
    it('能处理乘以零的情况',()=>{
      expect(multiply(5,0)).toBe(0)
    }); 
  })

 describe('除法函数测试', () => {
  it('正常除法应该返回正确结果', () => {
    expect(divide(10, 2)).toBe(5);
  });
  
  it('除以零应该抛出错误', () => {
    expect(() => divide(10, 0)).toThrowError('除数不能为零');
  });
  
  it('应该验证错误类型', () => {
    expect(() => divide(10, 0)).toThrowError(Error);
  });
});

});