import request from '@/utils/request'

// login getInfo logout

// 登录的方法
export const reqLogin = ({ mobile, password }) => request({
  url: `/sys/login`,
  method: 'POST',
  data: {
    mobile,
    password
  }
})

// 获取用户个人信息
export const reqGetProfile = () => request({
  url: `/sys/profile`,
  method: 'POST'
})

// 通过userId获取用户头像信息
export const reqGetAvatar = (userId) => request({
  url: `/sys/user/${userId}`
})
