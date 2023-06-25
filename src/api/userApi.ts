import type { User, CodeType, UserInfo, patientList, Patient } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', { mobile, password })
}

export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request<{ code: string }>('/code', 'GET', { mobile, type })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}

export const getUserInfo = () => {
  return request<UserInfo>('/patient/myUser', 'GET')
}

export const getPatientList = () => {
  return request<patientList>('/patient/mylist', 'GET')
}

export const addPatient = (patient: Patient) => {
  return request('/patient/add', 'POST', patient)
}

export const editPatient = (patient: Patient) => {
  return request('/patient/update', 'PUT', patient)
}

export const delPatient = (id: string) => {
  return request(`/patient/del/${id}`, 'DELETE')
}

// 查询患者详情
export const getPatientDetail = (id: string | undefined) => {
  return request<Patient>(`/patient/info/${id}`)
}
