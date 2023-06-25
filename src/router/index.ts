import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'

// vue2 使用 new 创建路由实例
const router = createRouter({
  // vue2 使用 mode: 'history' | 'hash'
  // vue3 使用 createWebHistory | createWebHashHistory 哈希模式 有 url 有 #
  // import.meta.env.BASE_URL 默认为基准地址 '/'
  // 部署到 root 根目录, 基准地址根据部署的基准地址来修改
  // 需要修改可以在 vite.config.ts base属性修改
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 前置路由守卫
// vue2 : 三个参数 to from next:Function 放行
// vue3 : 两个参数
router.beforeEach((to) => {
  NProgress.start()
  document.title = `优医问诊-${to.meta.title || ''}`
  // 判断是否有 token 有 决定是否可以访问 to 页面
  // 1. 有 token 排除 登录注册页面 => 正常访问
  // 2. 没有 token 跳转到登录页 => return '/login'
  const store = useUserStore()
  // 不需要检测的页面,白名单
  const whileList = ['/login', '/register']
  if (!store.user.token && !whileList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  // 修改标题
  document.title = `优医问诊-${to.meta.title || ''}`
  NProgress.done()
})

NProgress.configure({
  showSpinner: false
})
export default router
