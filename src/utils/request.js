import axios from 'axios'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  NProgress.start()
  if (localStorage.getItem('token')) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    NProgress.done()
    const { success, message } = res.data
    if (!success) {
      alert(message)
      return new Promise(() => {
      })
    } else {
      return res.data
    }
  },
  (error) => {
    if (error?.response?.status === 401) {
      // 说明token失效
      // 删除用户信息的token
      alert('token失效')
      store.commit('user/LOG_OUT')
      router.replace('/login')
      return new Promise(() => {
      })
    }
    alert(error.message)
    NProgress.done()
    return new Promise(() => {
    })
  }
)

export default instance

