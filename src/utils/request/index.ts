import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import { showFailToast } from 'vant'

const baseURL = import.meta.env.VITE_APP_BASE_URL
const timeout = 10000

type Data<T> = {
  code: number
  message: string
  data: T
}

const instance = axios.create({
  baseURL,
  timeout
})

instance.interceptors.request.use(
  (config) => {
    // 获取 token 在每次请求之前添加 token
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

// 后台接口响应 成功 但是 状态码不是 10000 则报错
instance.interceptors.response.use(
  (res) => {
    if (res.data?.code != 10000) {
      showFailToast(res.data?.message)
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err) => {
    if (err.response.status == 401) {
      // 删除用户信息重新登录
      const store = useUserStore()
      store.delUser()
      // 登录成功后获取返回地址,使用 query 获取 跳转到登录前页面
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

const request = <T>(url: string, method: Method = 'get', submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export { baseURL, instance, request }
