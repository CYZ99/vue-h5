import type { RouteRecordRaw } from 'vue-router'
import Test from '@/views/test/testPage.vue'

const routes: RouteRecordRaw[] = [
  // login
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/loginPage.vue'),
    meta: { title: '登录' }
  },
  // tabbar
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: '/notify',
        name: 'notify',
        component: () => import('@/views/notify/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article/index.vue'),
        meta: { title: '健康百科' }
      }
    ]
  },
  // 家庭档案
  {
    path: '/user/patient',
    component: () => import('@/views/user/patientPage.vue'),
    meta: { title: '家庭档案' }
  },
  // 极速问诊
  {
    path: '/consult/fast',
    component: () => import('@/views/consult/ConsultFast.vue'),
    meta: { title: '极速问诊' }
  },
  // 选择科室
  {
    path: '/consult/dep',
    component: () => import('@/views/consult/ConsultDep.vue'),
    meta: { title: '选择科室' }
  },
  // 病情描述
  {
    path: '/consult/illness',
    component: () => import('@/views/consult/ConsultIllness.vue'),
    meta: { title: '病情描述' }
  },
  // 支付页面
  {
    path: '/consult/pay',
    component: () => import('@/views/consult/ConsultPay.vue'),
    meta: { title: '订单支付' }
  },
  // 问诊室
  {
    path: '/room',
    component: () => import('@/views/room/index.vue'),
    meta: { title: '问诊室' },
    // 支付失败
    beforeEnter(to) {
      if (to.query.payResult === 'false') return '/user/consult'
    }
  },
  // 问诊订单
  {
    path: '/user/consult',
    component: () => import('@/views/user/ConsultOrder.vue'),
    meta: { title: '问诊记录' }
  },
  // 问诊详情
  {
    path: '/user/consult/:id',
    component: () => import('@/views/user/ConsultDetail.vue'),
    meta: { title: '问诊详情' }
  },
  // 购买药品预订单
  {
    path: '/medicine/pay',
    component: () => import('@/views/medicine/OrderPay.vue'),
    meta: { title: '购买药品' }
  },
  // 药品支付完成
  {
    path: '/order/pay/consult',
    component: () => import('@/views/orders/OrderPayResult.vue'),
    meta: { title: '药品支付完成' }
  },
  // 药品订单详情
  {
    path: '/order/:id',
    component: () => import('@/views/orders/OrderDetail.vue'),
    meta: { title: '药品订单详情' }
  },
  // 快递的位置详情
  {
    path: '/order/logistics/:id',
    component: () => import('@/views/orders/OrderLogistics.vue'),
    meta: { title: '订单快递详情' }
  },
  // 测试页面
  {
    path: '/test',
    name: 'test',
    component: Test
  }
]

export default routes
