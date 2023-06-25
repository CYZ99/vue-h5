<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'

import type { patientList, Patient } from '@/types/user'
import { getPatientList, addPatient, editPatient, delPatient } from '@/api/userApi'
import { nameRules, idCardRules } from '@/utils/rules/patientRule'
import { showConfirmDialog, showSuccessToast, showToast, type FormInstance } from 'vant'

const store = useConsultStore()
const route = useRoute()
const router = useRouter()

const list = ref<patientList>([])
// 控制弹出层的变量
const isShow = ref(false)
// 获取患者数据列表
const fetchPatientList = async () => {
  const res = await getPatientList()
  list.value = res.data
  // 患者不为空且,支持选择患者
  if (res.data.length > 0 && isSel) {
    // 从患者列表中获取默认患者
    // 1. 如果有默认患者,默认选中
    // 2. 就选择患者中的第一个默认选中
    const defaultPatient = res.data.find((item) => item.defaultFlag === 1)
    if (defaultPatient) {
      // 有默认患者
      selectPatientId.value = defaultPatient.id
    } else {
      selectPatientId.value = res.data[0].id
    }
  }
}

// 打开弹出层
const showDialog = (item?: Patient) => {
  if (item) {
    const { id, age, name, idCard, defaultFlag, gender } = item
    patient.value = { id, age, name, idCard, defaultFlag, gender }
  }
  isShow.value = true
}

// 关闭弹出层
const closeDialog = () => {
  isShow.value = false
  patient.value = { ...initPatient }
}

// 初始化表单默认值
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}

// 定义表单数据类型
const patient = ref<Patient>({ ...initPatient })

const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 处理 checkbox 数据类型的变换造成的问题
const defaultFlag = ref(false)
watch(defaultFlag, () => {
  patient.value.defaultFlag = defaultFlag.value ? 1 : 0
})

const form = ref<FormInstance>()
// 表单提交和编辑
const onSubmit = async () => {
  await form.value?.validate()
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗?'
    })
  }
  patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
  closeDialog()
  // 刷新获取列表数据
  fetchPatientList()
  showSuccessToast('添加患者成功')
}

// 删除患者
const deletePatient = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ?`
    })
    await delPatient(patient.value.id)
    isShow.value = false
    fetchPatientList()
    showSuccessToast('删除成功')
  }
}

// 家庭档案页面支持选择患者功能呢

// 是否支持选择患者
const isSel = computed(() => route.query.isChange === '1')

// console.log('路由参数', route.query)
// 点击选中患者
const selectPatientId = ref<string | undefined>('')
const selPatient = (id: string | undefined) => {
  // 支持选择患者功能才可以点击切换
  if (isSel.value) {
    selectPatientId.value = id
  }
}
onMounted(() => {
  fetchPatientList()
})

const next = () => {
  // 判断是否选中患者
  if (!selectPatientId.value) return showToast('请选择患者')
  // 存储到 store 中
  store.setPatient(selectPatientId.value)
  // 跳转页面
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isSel ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部选择栏 -->
    <div class="patient-change" v-if="isSel">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        @click="selPatient(item.id)"
        v-for="item in list"
        :key="item.id"
        class="patient-item"
        :class="{ selected: selectPatientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}</span>
          <span>{{ item.gender ? '男' : '女' }}</span>
          <span>{{ item.age }}</span>
        </div>
        <div class="icon" @click="showDialog(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showDialog()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <!-- 新增患者弹出层 -->
      <van-popup v-model:show="isShow" position="bottom">
        <!-- 导航栏 -->
        <cp-nav-bar
          :title="patient.id ? '编辑患者' : '新建患者'"
          :back="closeDialog"
          right-text="保存"
          @click-right="onSubmit"
        ></cp-nav-bar>
        <van-form @submit="onSubmit" ref="form">
          <van-field
            v-model="patient.name"
            :rule="nameRules"
            label="真实姓名"
            placeholder="请输入真实姓名"
          />
          <van-field
            v-model="patient.idCard"
            :rules="idCardRules"
            label="身份证号"
            placeholder="请输入身份证号"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <!-- 绑定一个 boolean 值 -->
              <van-checkbox v-model="defaultFlag" :icon-size="18" round />
            </template>
          </van-field>
        </van-form>
        <van-action-bar @click="deletePatient">
          <van-action-bar-button>删除</van-action-bar-button>
        </van-action-bar>
      </van-popup>
      <div class="patient-tip">最多可添加 6 人</div>
      <!-- 底部按钮 -->
      <div class="patient-next" v-if="isSel">
        <van-button type="primary" round block @click="next">下一步</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 0px 0 80px;
}

.patient-list {
  padding: 15px;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;

  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;

      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }

      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }

  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }

  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);

    .icon {
      color: var(--cp-primary);
    }
  }
}

.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;

  .cp-icon {
    font-size: 24px;
  }
}

:deep() {
  .van-popup {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }
}

.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}

.pb4 {
  padding-bottom: 4px;
}

// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;

  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}

.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
