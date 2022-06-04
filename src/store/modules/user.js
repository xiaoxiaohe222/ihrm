import {
  reqLogin,
  reqGetProfile,
  reqGetAvatar
} from '@/api/user'
import { constantRoutes, asyncRoutes, resetRouter } from '@/router'
import router from '@/router'

const state = {
  token: localStorage.getItem('token') || '',
  userInfo: {},
  avatar: '',
  routes: []
}
const mutations = {
  SET_ROUTES(state, asyncRoutes) {
    state.routes = [...constantRoutes, ...asyncRoutes]
  },
  SAVE_TOKEN(state, token) {
    state.token = token
  },
  SAVE_PROFILE(state, data) {
    state.userInfo = data
  },
  SAVE_AVATAR(state, data) {
    state.avatar = data
  },
  LOG_OUT(state) {
    state.token = ''
    state.userInfo = {}
    state.avatar = ''
    localStorage.removeItem('token')
    // 重置路由表
    state.routes = constantRoutes
    resetRouter()
  }
}
const actions = {
  async login_action({ commit }, { mobile, password }) {
    const res = await reqLogin({ mobile, password })
    if (res.code === 10000) {
      localStorage.setItem('token', res.data)
      commit('SAVE_TOKEN', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('登录失败'))
    }
  },
  async profile_action({ commit }) {
    const res = await reqGetProfile()
    if (res.code === 10000) {
      commit('SAVE_PROFILE', res.data)
      // 进行动态权限的处理
      const arr = []
      res.data.roles.menus.forEach((key) => {
        const re = asyncRoutes.find((item) => item.name === key)
        if (re) {
          arr.push(re)
        }
      })
      router.addRoutes([...arr, { path: '*', redirect: '/404', hidden: true }])
      commit('SET_ROUTES', arr)
      delRoutes()
      return 'ok'
    } else {
      return Promise.reject(new Error('获取用户个人信息失败'))
    }
  },
  async avatar_action({ commit, state }) {
    const res = await reqGetAvatar(state.userInfo.userId)
    if (res.code === 10000) {
      commit('SAVE_AVATAR', res.data.staffPhoto)
      return 'ok'
    } else {
      return Promise.reject(new Error('获取用户头像失败'))
    }
  }
}

export function delRoutes() {
  const roles = state.userInfo.roles
  const arr = []
  roles.menus.forEach((key) => {
    const re = asyncRoutes.find((item) => item.name === key)
    if (re) {
      arr.push(re)
    }
  })
  router.addRoutes(arr)
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
