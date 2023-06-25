import { getMedicalOrderDetail } from '@/api/medicineApi'
import type { OrderDetail } from '@/types/medicine'
import { onMounted, ref } from 'vue'

export const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}
