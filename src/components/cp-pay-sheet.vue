<script setup lang="ts">
import { ref } from 'vue'
import { getConsultOrderPayUrl } from '@/api/consultApi'
import { showToast, showLoadingToast } from 'vant'

const props = defineProps<{
  show: boolean
  orderId: string
  onClose?: () => void
  actualPayment?: number | undefined
  payCallback?: string
}>()
const paymentMethod = ref<0 | 1>(1)

const payBackUrl = import.meta.env.VITE_APP_PAY_BACK_URL
const getPayUrl = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '正在跳转支付', duration: 0 })
  const res = await getConsultOrderPayUrl({
    orderId: props.orderId, // 订单 id
    paymentMethod: paymentMethod.value, // 支付方式
    payCallback: props.payCallback || payBackUrl
  })
  // 跳到另一个支付宝网站
  window.location.href = res.data.payUrl
  // 支付成功之后跳转到 'http://localhost:5173/room' 页面
}
</script>

<template>
  <van-action-sheet
    :show="show"
    title="选择支付方式"
    :close-on-popstate="false"
    :before-close="onClose"
    :closeable="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment }}</p>
      <van-cell-group>
        <van-cell title="微信支付">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" round block @click="getPayUrl">立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .btn {
    padding: 15px;
  }

  .van-cell {
    align-items: center;

    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }

    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
