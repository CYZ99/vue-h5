<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, provide } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consultApi'
import { OrderType } from '@/enums/index'
// 1. 处理默认消息 聊天列表
const list = ref<Message[]>([])

const store = useUserStore()
const route = useRoute()
const orderId = route.query.orderId
// 0. 建立 socket 连接
let socket: Socket
const initSocket = () => {
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user.token}`
    },
    query: {
      orderId
    }
  })
  socket.on('connect', () => {
    console.log('浏览器和ws服务器连接成功')
  })
  socket.on('error', (error) => {
    console.log('出错了', error)
  })
  socket.on('disconnect', () => {
    console.log('浏览器与服务器连接断开')
  })
  // === 获取聊天记录 ===
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // console.log('建立连接后默认返回的数据', data)
    // 将获取到的信息存放在本地消息列表
    // 准备转换常规列表
    const arr: Message[] = []
    // 1. 将发送消息的时间存放到 arr 中
    data.forEach((item) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      // 2. 添加聊天信息
      arr.push(...item.items)
    })
    // 将循环完的消息结果追加到List
    list.value.push(...arr)
    console.log(list.value)
  })
  // === 订单状态发生变化 ===
  // 监听状态变更
  socket.on('statusChange', async () => {
    // 获取订单详情
    getOrderDetail()
  })
}

// 2. 发送文字信息
// 发送信息需要 发送人 收消息人 消息类型 消息内容
const consultDetail = ref<ConsultOrderItem>()
const getOrderDetail = async () => {
  const res = await getConsultOrderDetail(orderId as string)
  // console.log('订单详情', res.data)
  consultDetail.value = res.data
}

// 发送文字信息
const sendText = (text: string) => {
  console.log('消息', text)
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consultDetail.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

// 发送图片信息
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consultDetail.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 依赖注入,医生评价组件需要, consult 信息,
provide('consult', consultDetail)
// 提供刷新页面的方法
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    // 输入评分
    item.msg.evaluateDoc = { score }
    // 修改评价状态
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)

// 组件挂载时建立连接
onMounted(() => {
  // 建立连接,和默认消息渲染
  initSocket()
  // 获取订单消息
  getOrderDetail()
  // 接收消息
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    // list消息列表更新后,直接滚动会失效
    // 修改数据之后的 dom 的更新是异步的,等到异步更新结束,在执行滚动
    // vue2 this.$nextTick(cb) | vue3 : nextTick()
    await nextTick()
    // 收到消息之后滚动到底部,两个参数 横向滚动, 纵向滚动
    window.scrollTo(0, document.body.scrollHeight)
  })
})
// 组件销毁时断开连接,避免资源浪费
onUnmounted(() => {
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 问诊状态 -->
    <room-status
      :status="consultDetail?.status"
      :countdown="consultDetail?.countdown"
    ></room-status>
    <!-- 问诊聊天列表信息 -->
    <room-message :list="list"></room-message>
    <!-- 底部操作栏,发送信息 -->
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consultDetail?.status != OrderType.ConsultChat"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  /* padding-top: 50px; */
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
