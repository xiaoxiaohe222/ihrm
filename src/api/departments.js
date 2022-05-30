import request from '@/utils/request'
// 获取所有的部门列表
export const reqDepartmentList = () => request({
  url: `/company/department`
})
//  删除部门
export const reqDelDept = (id) => request({
  url: `/company/department/${id}`,
  method: 'DELETE'
})
//  添加部门
export const reqAddDept = (data) => request({
  url: `/company/department`,
  method: 'POST',
  data
})
// 根据部门id查询部门详情
export const reqDepartDetail = (id) => request({
  url: `/company/department/${id}`
})
// 根据id修改部门数据
export const reqUpdateDepart = (data) => {
  const id = data.id
  delete data.id
  return request({
    url: `/company/department/${id}`,
    method: 'PUT',
    data
  })
}
