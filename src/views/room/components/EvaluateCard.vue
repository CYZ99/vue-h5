<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import { showToast } from 'vant'
import type { EvaluateDoc } from '@/types/room'
import { evaluateConsultOrder } from '@/api/consultApi'
import type { ConsultOrderItem } from '@/types/consult'
const score = ref(0)
const content = ref('')
// 禁用按钮样式, 没用评分或者没有评价
const disabled = computed(() => !score.value || !content.value)
// 匿名评价
const anonymousFlag = ref(false)

defineProps<{
  evaluateDoc?: EvaluateDoc
}>()

// 依赖注入,从爷爷组件获取订单数据
const consult = inject<Ref<ConsultOrderItem>>('consult')
const complateEva = inject<(score: number) => void>('complateEva')
// 提交表单
const onSubmit = async () => {
  if (!score.value) return showToast('请输入评分')
  if (!content.value) return showToast('请输入评价信息')
  if (!consult?.value) return showToast('未找到订单消息')
  if (consult?.value.docInfo?.id) {
    await evaluateConsultOrder({
      docId: consult?.value?.docInfo?.id,
      orderId: consult.value.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
  }
  // 评价完之后需要刷新页面,从爷爷组件获取事件
  complateEva && complateEva(score.value)
}
</script>

<template>
  <!-- 已经评价过的直接显示评价的内容 -->
  <div class="evaluate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <!-- 还未评价,需要双向绑定数据进行评价 -->
  <div class="evaluate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <!-- 五星好评 -->
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <!-- 评价输入框 -->
    <van-field
      type="textarea"
      v-model="content"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button
        type="primary"
        size="small"
        round
        @click="onSubmit"
        :class="{ disabled }"
        :disabled="disabled"
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evaluate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;

  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }

  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    :deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }

        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }

        height: 16px;
      }

      .van-button {
        padding: 0 16px;

        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
