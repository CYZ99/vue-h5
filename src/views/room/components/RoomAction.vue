<script setup lang="ts">
import { ref } from 'vue'
import { showLoadingToast } from 'vant'
import { uploadImage } from '@/api/consultApi'
import type { Image } from '@/types/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
// 接诊状态
defineProps<{
  disabled: boolean
}>()

// 在发送框输入信息,按下 enter 发送信息,给父组件,父组件在通过 socket.sendText 发送消息到 ws 服务器,
// 医生端就可以收到消息了
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()
const text = ref('')

const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}
// 发送图片
const sendImage: UploaderAfterRead = async (data) => {
  // 发送一张图片不需要,数组的形式,以对象的形式上传
  if (Array.isArray(data)) return
  if (!data.file) return
  showLoadingToast('正在上传')
  const res = await uploadImage(data.file)
  emit('send-image', res.data)
}
</script>

<template>
  <div class="room-action">
    <!-- 发信息 -->
    <van-field
      type="text"
      v-model="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
      @keyup.enter="sendText"
    >
    </van-field>
    <!-- 发送图片 -->
    <van-uploader :preview-image="true" :disabled="disabled" :after-read="sendImage">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;

  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }

  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
