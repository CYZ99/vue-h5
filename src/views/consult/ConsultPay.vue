<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useConsultStore } from '@/stores'
import { getConsultOrderPreData, createConsultOrder } from '@/api/consultApi'

import { getPatientDetail } from '@/api/userApi'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const store = useConsultStore()
// 获取预先支付信息
const payInfo = ref<ConsultOrderPreData>()

// 获取支付信息
const loadData = async () => {
  try {
    const res = await getConsultOrderPreData({
      type: store.consult.type,
      illnessType: store.consult.illnessType
    })
    payInfo.value = res.data
    // 设置默认优惠卷
    store.setCoupon(payInfo.value.couponId)
  } catch (error) {
    showToast('缺少必要问诊信息,请重新选择')
    router.push('/home')
  }
}

// 获取患者信息
const patient = ref<Patient>()

const loadPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}

onMounted(() => {
  loadData()
  loadPatient()
})
// 打开支付窗口
const argee = ref(false)
const show = ref(false)

const orderId = ref('')
const openPay = async () => {
  // 判断用户是否同意协议
  if (!argee.value) return showToast('请勾选同意支付协议!')
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  // 清除 store 中的数据
  store.clear()
  // 打开选择窗口
  show.value = true
}

// 打开支付选项后不可回退,只影响当前页面
onBeforeRouteLeave(() => {
  if (orderId.value) return false
  show.value = false
})

// 关闭前做的事情
const onClose = async () => {
  try {
    await showConfirmDialog({
      title: '关闭支付',
      message: '关闭支付后无法获得医生恢复,需要重新填写信息',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付',
      confirmButtonColor: 'var(--cp-primary)'
    })
    return false
  } catch {
    // 关闭页面
    orderId.value = ''
    router.push('/user/consult')
    return true
  }
}
</script>

<template>
  <!-- 支付信息 -->
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <!-- <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p> -->
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-$${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-$${payInfo?.couponDeduction}`" />
      <van-cell title="实付款" :value="`$${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <!-- 患者信息 -->
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name}  |  ${patient?.gender === 0 ? '女' : '男'}  |  ${patient?.age}`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="argee">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
      @click="openPay"
    />
    <!-- 支付弹层 -->
    <cp-pay-sheet
      v-model:show="show"
      :orderId="orderId"
      :onClose="onClose"
      :actualPayment="payInfo?.actualPayment"
    ></cp-pay-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 0 0 50px 0;
}

.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;

  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }

  .desc {
    flex: 1;

    > span {
      display: block;
      color: var(--cp-tag);

      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}

.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }

    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}

.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}

.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    color: var(--cp-primary);
  }
}

::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}

// 支付选择框样式
</style>
