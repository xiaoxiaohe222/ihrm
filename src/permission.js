// 控制页面的权限跳转的
import router from '@/router'
import store from '@/store'
const whiteNames = ['/404', '/login']

router.beforeEach((to, from, next) => {
  if (store.state.user.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteNames.indexOf(to.path) !== -1) { // 表示在白名单里面 直接放心
      next()
    } else {
      next('/login')
    }
  }
})
