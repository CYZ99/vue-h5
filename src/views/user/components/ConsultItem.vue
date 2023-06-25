<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { deleteOrder } from '@/api/consultApi'
import { showFailToast, showSuccessToast } from 'vant'
import { useLookPre } from '@/hooks/useLookPre'
import { useCencelConsult } from '@/hooks/useCencelConsult'

const { loading, cencelConsultOrder } = useCencelConsult()

const props = defineProps<{ item: ConsultOrderItem }>()
const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()
// 显示处方钩子函数
const showPrescription = useLookPre()
const showPopover = ref(false)
const actions = computed(() => [
  { text: '查看处方', disabled: !props.item.prescriptionId },
  { text: '删除订单' }
])
const onSelect = (actions: { text: string }, i: number) => {
  // 数组的第二项是删除功能
  if (i === 1) {
    deleteConsultOrder(props.item)
  }
  // 查看处方
  if (i === 0) {
    showPrescription(props.item.prescriptionId)
  }
}

// 取消订单 -> 封装到钩子
// const loading = ref(false)
// const cencelConsultOrder = async (item: ConsultOrderItem) => {
//   try {
//     loading.value = true
//     await cancelOrder(item.id)
//     // 修改订单状态
//     item.status = OrderType.ConsultCancel
//     item.statusValue = '已取消'
//     showSuccessToast('取消订单成功')
//   } catch (error) {
//     showFailToast('取消订单失败')
//   } finally {
//     loading.value = false
//   }
// }
const deleteLoading = ref(false)
// 删除订单
const deleteConsultOrder = async (item: ConsultOrderItem) => {
  try {
    deleteLoading.value = true
    await deleteOrder(item.id)
    // 修改订单状态
    item.status = OrderType.MedicineCancel
    item.statusValue = '已删除'
    // 传递给父组件过滤掉数组中的该项,达到删除功能
    emit('on-delete', item.id)
    showSuccessToast('删除订单成功')
  } catch (error) {
    showFailToast('删除订单失败')
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name || '暂未分配医生' }}</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 底部按钮 - 根据不同的订单状态显示不同的操作按钮 -->
    <!-- 1. 待支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cencelConsultOrder(item)"
      >
        取消问诊
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`">
        去支付
      </van-button>
    </div>
    <!-- 2. 待接诊 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cencelConsultOrder(item)"
        >取消问诊
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room/?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 3.咨询中 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        v-if="item.prescriptionId"
        @click="showPrescription(item.prescriptionId)"
        class="gray"
        plain
        size="small"
        round
      >
        查看处方
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 4.已完成 -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <div class="more">
        <van-popover
          placement="top-start"
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference> 更多 </template>
        </van-popover>
      </div>
      <van-button class="gray" plain size="small" round :to="`/room?orderId=${item.id}`">
        问诊记录
      </van-button>
      <van-button v-if="!item.evaluateId" type="primary" plain size="small" round>
        去评价
      </van-button>
      <van-button v-else class="gray" plain size="small" round> 查看评价 </van-button>
    </div>
    <!-- 5. 删除订单 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="deleteLoading"
        @click="deleteConsultOrder"
      >
        删除订单
      </van-button>
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;

  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;

    .img {
      width: 20px;
      height: 20px;
    }

    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }

    > span {
      color: var(--cp-tag);

      &.orange {
        color: #f2994a;
      }

      &.green {
        color: var(--cp-primary);
      }
    }
  }

  .body {
    padding: 15px 15px 8px 15px;

    .body-row {
      display: flex;
      margin-bottom: 7px;
    }

    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }

    .body-value {
      width: 250px;

      &.tip {
        color: var(--cp-tip);
      }
    }
  }

  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .van-button {
      margin-left: 10px;
      padding: 0 16px;

      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }

    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
