<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { OrderPre, AddressItem } from '@/types/medicine'
import { getAddressList, getMedicalOrderPre, createMedicalOrder } from '@/api/medicineApi.js'
import { showToast } from 'vant'
// 1. 预获取订单信息
const route = useRoute()
// 1. 定义变量接收预订单的信息
const orderPre = ref<OrderPre>()
// 2. 定义变量接收地址信息
const address = ref<AddressItem>()

// 3. 定义函数发起网络请求
const getOrderPre = async () => {
  const res = await getMedicalOrderPre({ prescriptionId: route.query.id as string })
  console.log('支付信息', res.data)
  orderPre.value = res.data
}

const getAddress = async () => {
  const res = await getAddressList()
  console.log('默认收货地址', res.data)
  address.value = res.data[0]
}

// 2. 支付订单
const argee = ref(false)
const loading = ref(false)
const show = ref(false)
const orderId = ref('')
const openPay = async () => {
  // 判断是否同意支付协议
  if (!argee.value) return showToast('请同意支付协议!')
  if (!address.value) return showToast('请选择收获地址!')
  if (!orderPre.value?.id) return showToast('不是有效的处方ID!')
  if (!orderId.value) {
    loading.value = true
    // 创建订单
    try {
      const res = await createMedicalOrder({
        id: orderPre.value.id, // 处方ID
        addressId: address.value.id, // 默认收获地址ID
        couponId: orderPre.value.couponId // 优惠卷ID
      })
      // 给订单 ID 赋值
      orderId.value = res.data.id
      loading.value = false
      show.value = true
    } finally {
      loading.value = false
    }
  } else {
    show.value = false
  }
}
onMounted(() => {
  getOrderPre()
  getAddress()
})
</script>

<template>
  <div class="order-pay-page" v-if="orderPre && address">
    <cp-nav-bar title="药品支付" />
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ address.province + address.city + address.county }}</span>
      </p>
      <p class="detail">{{ address.addressDetail }}</p>
      <p>
        {{ address.receiver }}
        {{ address.mobile.replace(/^(\d{3})\d+(\d{4})$/, '\$1****\$2') }}
      </p>
    </div>
    <div class="order-medical">
      <div class="head">
        <h3>优医药房</h3>
        <small>优医质保 假一赔十</small>
      </div>
      <div class="item van-hairline--top" v-for="med in orderPre.medicines" :key="med.id">
        <img class="img" :src="med.avatar" alt="" />
        <div class="info">
          <p class="name">
            <span>{{ med.name }}</span>
            <span>x{{ med.quantity }}</span>
          </p>
          <p class="size">
            <van-tag v-if="med.prescriptionFlag === 1">处方药</van-tag>
            <span>{{ med.specs }}</span>
          </p>
          <p class="price">￥{{ med.amount }}</p>
        </div>
        <div class="desc">{{ med.usageDosag }}</div>
      </div>
    </div>
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre.payment}`" />
        <van-cell title="运费" :value="`￥${orderPre.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="argee">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      :price="orderPre.actualPayment * 100"
      button-text="立即支付"
      button-type="primary"
      text-align="left"
      :loading="loading"
      @click="openPay"
    >
    </van-submit-bar>
    <!-- 支付弹层 -->
    <cp-pay-sheet
      v-model:show="show"
      :orderId="orderId"
      :actualPayment="orderPre.actualPayment"
      payCallback="http://localhost:5173/order/pay/consult"
    ></cp-pay-sheet>
  </div>
  <!-- 异步请求加载时的骨架屏 -->
  <div class="order-pay-page" v-else>
    <cp-nav-bar title="药品支付" />
    <van-skeleton class="vsk" title :row="3" />
    <van-skeleton class="vsk" title :row="3" />
    <van-skeleton class="vsk" title :row="12" />
  </div>
</template>

<style lang="scss" scoped>
.vsk {
  margin-top: 20px;
}

:deep(.van-nav-bar) {
  background-color: var(--cp-primary);

  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}

:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }

  .van-cell__value {
    font-size: 16px;
  }

  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}

:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

  .van-button {
    width: 200px;
  }
}

.order-pay-page {
  padding: 0px 0 65px;
}

.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;

  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;

    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }

  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }

  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-medical {
  background-color: #fff;
  padding: 0 15px;

  .head {
    display: flex;
    height: 54px;
    align-items: center;

    > h3 {
      font-size: 16px;
      font-weight: normal;
    }

    > small {
      font-size: 13px;
      color: var(--cp-tag);
      margin-left: 10px;
    }
  }

  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;

    .img {
      width: 80px;
      height: 70px;
      border-radius: 2px;
      overflow: hidden;
    }

    .info {
      padding-left: 15px;
      width: 250px;

      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;

        > span:first-child {
          width: 200px;
        }

        > span:last-child {
          width: 50px;
          text-align: right;
        }
      }

      .size {
        margin-bottom: 5px;

        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }

        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }

      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }

    .desc {
      width: 100%;
      background-color: var(--cp-bg);
      border-radius: 4px;
      margin-top: 10px;
      padding: 4px 10px;
      color: var(--cp-tip);
    }
  }
}

.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;

  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;

    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }

    margin-bottom: 30px;
  }

  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}
</style>
