import { watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useClipboard } from '@vueuse/core'
const { copy, copied, isSupported } = useClipboard()

// 使用 useCore 实现 文本复制功能
// copy 复制函数,需要传入要复制的文本
// copied 是一个 Ref 布尔值
// isSupported 判断浏览器是否支持复制功能

const useCopy = () => {
  const onCopy = async (copyText: string) => {
    if (!isSupported.value) return showFailToast('浏览器不支持复制此文本')
    await copy(copyText)
  }
  watch(copied, () => {
    showSuccessToast('复制成功')
  })
  return { onCopy }
}

export { useCopy }
