<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consultApi'
import { getConsultFlagText, getIllnessTimeText } from '@/utils/format'
import { useCopy } from '@/hooks/useCopy'
import { useCencelConsult } from '@/hooks/useCencelConsult'

const { cencelConsultOrder, loading } = useCencelConsult()
const { onCopy } = useCopy()
const route = useRoute()
const item = ref<ConsultOrderItem>()
const orderId: string = route.params.id as string

onMounted(async () => {
  // 获取详情数据
  const res = await getConsultOrderDetail(orderId)
  console.log(res.data)
  item.value = res.data
})
const show = ref(false)
</script>

<template>
  <div class="consult-detail-page" v-if="item">
    <cp-nav-bar title="问诊详情" />
    <div class="detail-head">
      <div class="text">
        <h3>图文问诊 {{ item.actualPayment }} 元</h3>
        <span class="sta green">{{ item.statusValue }}</span>
        <p class="tip">服务医生信息</p>
      </div>
      <div class="card">
        <img class="avatar" src="@/assets/avatar-doctor.svg" alt="" />
        <p class="doc">
          <span>极速问诊</span>
          <span>{{ item.docInfo?.name }}</span>
        </p>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="detail-patient">
      <van-cell-group :border="false">
        <van-cell
          title="患者信息"
          :value="`${item.patientInfo.name} | ${item.patientInfo.genderValue} | ${item.patientInfo.age}岁`"
        />
        <van-cell title="患病时长" :value="getIllnessTimeText(item.illnessTime)" />
        <van-cell title="就诊情况" :value="getConsultFlagText(item.consultFlag)" />
        <van-cell title="病情描述" :label="item.illnessDesc" />
      </van-cell-group>
    </div>
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell-group :border="false">
        <van-cell title="订单编号">
          <template #value>
            <span class="copy" @click="onCopy(item?.orderNo as string)">复制</span>
            {{ item.orderNo }}
          </template>
        </van-cell>
        <van-cell title="创建时间" :value="item.createTime" />
        <van-cell title="应付款" :value="`￥${item.payment}`" />
        <van-cell title="优惠券" :value="`-￥${item.couponDeduction}`" />
        <van-cell title="积分抵扣" :value="`-￥${item.pointDeduction}`" />
        <van-cell title="实付款" :value="`￥${item.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <!-- <div class="detail-time">
        请在 <van-count-down :time="10000 * 1000" /> 内完成支付，超时订单将取消
      </div> -->
    <div class="detail-action van-hairline--top">
      <div class="price">
        <span>需付款</span>
        <span>￥{{ item.actualPayment }}</span>
      </div>
      <van-button type="default" round @click="cencelConsultOrder" :loading="loading">
        取消问诊
      </van-button>
      <van-button type="primary" round @click="show = true">继续支付</van-button>
      <cp-pay-sheet
        v-model:show="show"
        :orderId="orderId"
        :actualPayment="item.actualPayment"
      ></cp-pay-sheet>
    </div>
  </div>
  <div class="consult-detail-page" v-else>
    <cp-nav-bar title="问诊详情" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-detail-page {
  padding: 0 0 110px 0;
}

.detail-head {
  height: 140px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 135px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }

  padding: 15px;

  .text {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 3px;

    .sta {
      color: var(--cp-tag);
      font-weight: 500;
      font-size: 16px;

      &.green {
        color: var(--cp-primary);
      }

      &.orange {
        color: #f2994a;
      }
    }

    .tip {
      width: 100%;
      color: var(--cp-text3);
      margin-top: 5px;
    }
  }

  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);

    .avatar {
      width: 38px;
      height: 38px;
    }

    .doc {
      flex: 1;
      padding-left: 15px;

      > span {
        display: block;
        font-size: 16px;

        &:last-child {
          font-size: 13px;
          color: var(--cp-text3);
        }
      }
    }

    .van-icon {
      color: var(--cp-tip);
    }
  }
}

.detail-patient {
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
  }
}

.detail-order {
  > h3 {
    padding: 10px 18px;
    font-weight: normal;
  }

  .copy {
    padding: 2px 10px;
    border: 1px solid var(--cp-primary);
    background-color: var(--cp-plain);
    color: var(--cp-primary);
    font-size: 12px;
    border-radius: 12px;
    margin-right: 10px;
  }

  :deep(.van-cell__title) {
    width: 70px;
    flex: none;
  }

  .price :deep(.van-cell__value) {
    font-size: 16px;
    color: var(--cp-price);
  }
}

.detail-action {
  height: 65px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
  padding: 0 15px;
  box-sizing: border-box;

  .price {
    flex: 1;

    > span:last-child {
      font-size: 18px;
      color: var(--cp-price);
      padding-left: 5px;
    }
  }

  .van-button {
    margin-left: 10px;
    padding-left: 17px;
    padding-right: 17px;
  }

  :deep(.van-button--default) {
    background-color: var(--cp-bg);
    color: var(--cp-text3);
  }
}

.van-cell {
  padding-left: 18px;
  padding-right: 18px;
}

.detail-time {
  position: fixed;
  left: 0;
  bottom: 65px;
  width: 100%;
  height: 44px;
  background-color: #fff7eb;
  text-align: center;
  line-height: 44px;
  font-size: 13px;
  color: #f2994a;

  .van-count-down {
    display: inline;
    color: #f2994a;
  }
}
</style>
