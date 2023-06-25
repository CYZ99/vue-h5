import { getPrescriptionPic } from '@/api/consultApi'
import { showImagePreview } from 'vant'

export const useLookPre = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }
  return showPrescription
}
