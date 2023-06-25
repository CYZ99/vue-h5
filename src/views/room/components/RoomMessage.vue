<script setup lang="ts">
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useLookPre } from '@/hooks/useLookPre'
import EvaluateCard from './EvaluateCard.vue'
import { showImagePreview, showToast } from 'vant'
import type { Message, Prescription } from '@/types/room'
import { MsgType, PrescriptionStatus } from '@/enums/index'
import type { Image } from '@/types/consult'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/format'
import dayjs from 'dayjs'

const store = useUserStore()
defineProps<{ list: Message[] }>()
// 后端返回的就诊时间是一个数字
// 转换数据格式,将对应的数字转换成 label
// const getIllnessTimeText = (time: IllnessTime) => {
//   return timeOptions.find((item) => item.value === time)?.label
// }

// const getConsultFlagText = (flag: 0 | 1) => {
//   return flagOptions.find((item) => item.value === flag)?.label
// }
// 2. 预览图片
const previewImg = (pictures?: Image[]) => {
  if (pictures && pictures.length) showImagePreview(pictures.map((item) => item.url))
}

// 3. 格式化时间
const formatTime = (time: string) => dayjs(time).format('HH:mm')

// 4. 解决图片渲染完,没有滚动页面的问题
const loadSuccess = () => {
  window.scrollTo(0, document.body.scrollHeight)
}

// // 5.显示处方详情
// const showPrescription = async (id?: string) => {
//   if (id) {
//     const res = await getPrescriptionPic(id)
//     showImagePreview([res.data.url])
//   }
// }
// 使用 钩子
const showPrescription = useLookPre()

const router = useRouter()
// 6. 购买药品
const buy = (pre?: Prescription) => {
  if (pre) {
    //判断处方状态
    if (pre.status === PrescriptionStatus.Invalid) return showToast('处方失效')
    // 没有支付
    if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
      return router.push(`/medicine/pay?id=${pre.id}`)
    return router.push(`/order/${pre.orderId}`)
  }
}
</script>

<template>
  <template v-for="{ msgType, msg, createTime, from } in list" :key="msg.id">
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord.patientInfo.name }}
          {{ msg.consultRecord.patientInfo.genderValue }}
          {{ msg.consultRecord.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <!--图片预览 -->
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"> 点击查看 </van-col>
      </van-row>
    </div>
    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通用通知 -->
    <div class="msg msg-tip" v-if="msgType === 31">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 5.发送文字 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_4.jpg" />
    </div>
    <!-- 7.接收文字 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user.id !== from">
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_2.jpg" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 显示图片信息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image @load="loadSuccess" fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 回显图片 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_4.jpg" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image @load="loadSuccess" fit="contain" :src="msg.picture?.url" />
      </div>
    </div>
    <!-- 处方消息 -->
    <!-- 处方 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content" v-if="msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">
              原始处方
              <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription.name }}
            {{ msg.prescription.genderValue }}
            {{ msg.prescription.age }}岁
            {{ msg.prescription.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span @click="buy(msg.prescription)">购买药品</span>
        </div>
      </div>
    </div>
    <!-- 9.通知-结束 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 10.评价卡片，后期实现 -->
    <div
      class="msg msg-comment"
      v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm"
    >
      <!-- 传入已经评价过的东西,用于回显 -->
      <evaluate-card :evaluateDoc="msg.evaluateDoc" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
@import '@/style/room.scss';
</style>
