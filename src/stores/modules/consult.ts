import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    const consult = ref<PartialConsult>({})
    // 第一个页面 设置问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 第二个页面 设置极速问诊类型 1 三甲 0 普通
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 第三个页面 设置科室
    const setDep = (id: string) => (consult.value.depId = id)
    // 设置病情描述
    // TS 内置工具 选择类型
    const setIllness = (
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 家庭档案页面 -> 设置患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 设置优惠券
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    // 清空记录
    const clear = () => (consult.value = {})
    return { consult, setType, setIllnessType, setDep, setIllness, setPatient, setCoupon, clear }
  },
  {
    persist: true
  }
)
