import { sendMobileCode } from '@/api/userApi'
import { onUnmounted, ref } from 'vue'
import { showSuccessToast, type FormInstance } from 'vant'

// 传入 mobile 解耦
// 复用技巧
// 1. 相同部分直接复制
// 2. 不同部分以函数参数形式传入
export function useSendCode(mobile: string) {
  // 定义变量
  let timer: number
  const time = ref(0)
  const form = ref<FormInstance>()
  const code = ref('')
  // 实现逻辑
  const send = async () => {
    if (time.value > 0) return
    await form.value?.validate('mobile')
    const res = await sendMobileCode(mobile, 'login')
    code.value = res.data.code
    showSuccessToast('验证码发送成功')
    // 自动填写验证码
    clearInterval(timer)
    time.value = 60
    timer = window.setInterval(() => {
      time.value--
      if (time.value < 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  onUnmounted(() => {
    window.clearInterval(timer)
  })
  // 返回页面需要的变量
  return { time, send, code, form }
}
