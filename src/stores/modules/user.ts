import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

// 定义 user store
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 空对象的变量 使用 as断言指定类型
    const user = ref<User>({} as User)
    // 方法:
    // 存储用户信息 登录成功
    const setUser = (userData: User) => {
      user.value = userData
    }
    // 退出登录时删除用户信息
    const delUser = () => {
      user.value = {} as User
    }
    // 返回变量和方法
    return { user, setUser, delUser }
  },
  // 方式一: 默认存储该 store 的所有数据.以 store 名也就是第一个参数作为存储的 storage key
  // {
  //   persist: true // 开启数据持久化
  // }
  // 方式二: 自定义存储的 key 和 存储的数据
  {
    persist: {
      key: 'cp-user-99',
      paths: ['user'] // 指定存储的变量
    }
  }
)
