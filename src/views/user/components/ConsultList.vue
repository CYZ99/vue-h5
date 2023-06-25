<script setup lang="ts">
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import type { ConsultOrderParams, ConsultOrderItem } from '@/types/consult'
import { getConsultOrderList } from '@/api/consultApi'

const props = defineProps<{ type: ConsultType }>()

// 接口参数
const params = ref<ConsultOrderParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)

// 加载数据,默认会执行一次
// 上拉滚动到上一次的底部会再次执行
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

const onDelete = async (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
  if (!list.value.length) onLoad()
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
