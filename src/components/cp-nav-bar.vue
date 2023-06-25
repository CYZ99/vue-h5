<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
// 接收父传子的属性
const props = defineProps<{
  title: string
  rightText?: string
  back?: () => void
}>()

// 子传父 触发按钮
const emit = defineEmits<{ (e: 'click-right'): void }>()

const onClickLeft = () => {
  /**
   * 返回上次页面,
   *  1.先判断是否是否存在返回的页面, 通过浏览器上的 history 全局对象中的 state.back 判断
   *  2. 如果存在跳转到上一次的页面,不存在返回首页
   */
  // 自定义弹出层,
  if (props.back) {
    return props.back()
  }
  if (history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="home">
    <van-nav-bar
      :title="title"
      :right-text="rightText"
      left-arrow
      @click-left="onClickLeft"
      @click-right="emit('click-right')"
    />
  </div>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
    }
  }
}
</style>
