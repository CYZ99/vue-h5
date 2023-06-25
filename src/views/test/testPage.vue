<script setup lang="ts">
import { useUserStore } from '@/stores'
// import { request } from '@/utils/request'
import { onMounted, ref } from 'vue'
import SonPage from './SonPage.vue'

const store = useUserStore()

// 测试父传子 变量
const count = ref(0)
const title = ref('中国')
const handleUser = () => {
  store.setUser({
    id: '1',
    account: '1121',
    mobile: '123129839184',
    token: '13123assda',
    avatar: ''
  })
}

// 测试 axios 封装 401
// const getHome = async () => {
//   const res = await request.get('/patient/myUser')
//   console.log(res)
// }

// // 测试正常和失败的情况.
// const login = async () => {
//   const res = await request.post('/login/password', {
//     mobile: '13211112222',
//     password: 'abc123450'
//   })
//   console.log(res)
// }

onMounted(() => {
  // getHome()
  // login()
})
</script>

<template>
  <div class="home">
    <!-- <h2>{{ store.user }}</h2> -->
    <van-button square type="primary">方形按钮</van-button>
    <button class="btn" @click="handleUser">点击保存数据</button>
    <svg aria-hidden="true">
      <!-- #icon-文件夹名称-图片名称 -->
      <use href="#icon-login-eye-off" />
    </svg>
    <cp-icon name="login-eye-on"></cp-icon>
  </div>
  <!-- 1. 组件间的双向绑定语法糖写法 默认绑定的属性是 v-model:modelValue -->
  <son-page v-model="count" v-model:title="title"></son-page>
  <!-- $event:
    1. 如果是原生 js 事件 它的值 => 事件对象
    2. 如果是组件自定义事件,它的值是 =>子传父的 data
  -->
  <!-- <son-page :model-value="count" :title="title" @update:model-value="count = $event"></son-page> -->
  <!-- 2. v-model 的参数 -->
  <!-- <son-page v-model="count" v-model:title="title"></son-page> -->
</template>

<style lang="scss" scoped>
.home {
  $fontColor: skyblue;
  color: $fontColor;
}

.btn {
  $btnWidth: 100px;
  width: $btnWidth;
  color: var(--cp-font-color);
}
</style>
