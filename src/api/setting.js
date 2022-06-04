import request from '@/utils/request'

/**
 * 获取角色列表
 * ***/
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除角色/sys/role/{id}
export const reqDelRole = (id) => request({
  url: `/sys/role/${id}`,
  method: 'DELETE'
})
// 更新角色/sys/role/{id}
export const reqUpdateRole = (data) => request({
  url: `/sys/role/${data.id}`,
  data,
  method: 'put'
})

/** *
 * 新增角色
 * ***/
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

// 获取角色详情
export const getDetail = (id) => request({
  url: `/sys/role/${id}`
})
