import { ref } from 'vue'
import type { ConsultOrderItem } from '@/types/consult'
import { cancelOrder } from '@/api/consultApi'
import { OrderType } from '@/enums'
import { showFailToast, showSuccessToast } from 'vant'
const useCencelConsult = () => {
  const loading = ref(false)
  const cencelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelOrder(item.id)
      // 修改订单状态
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消订单成功')
    } catch (error) {
      showFailToast('取消订单失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, cencelConsultOrder }
}

export { useCencelConsult }
