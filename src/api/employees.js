import request from '@/utils/request'
// 获取员工列表
export const reqEmployeesSimple = () => request({
  url: `/sys/user/simple`
})
