import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: '/coca/',
  routes
})
/*
  mode: ['hash','history'][0],//'hash',//'history',
  base: '/coca/',
*/




/**
 * ===============================
 * AUTH + LEVEL GUARD
 * ===============================
 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // user lưu trong login
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // 👉 chưa login = level 0 (guest)
  const userLevel = user?.level ?? 0

  // ===============================
  // 1. route public (login, etc)
  // ===============================
  if (to.meta?.public) {
    return next()
  }

  // ===============================
  // 2. chưa login -> vẫn vào public level 0 routes
  // ===============================
  if (!token) {
    // chỉ cho phép level 0
    if ((to.meta?.level ?? 0) === 0) {
      return next()
    }
    return next('/login')
  }

  // ===============================
  // 3. check level
  // ===============================
  const routeLevel = to.meta?.level ?? 0

  if (userLevel >= routeLevel) {
    return next()
  }

  // không đủ quyền
  return next('/home')
})

export default router