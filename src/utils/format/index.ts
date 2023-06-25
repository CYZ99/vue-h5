import { timeOptions, flagOptions } from '@/api/const'
import type { IllnessTime } from '@/enums/index'
const getIllnessTimeText = (time: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}

const getConsultFlagText = (flag: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}

export { getIllnessTimeText, getConsultFlagText }
