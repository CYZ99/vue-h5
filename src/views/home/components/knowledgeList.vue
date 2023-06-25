<script setup lang="ts">
import KnowledgeCard from './knowledgeCard.vue'
import { ref } from 'vue'
import type { KnowledgeType, KnowledgeList, KnowledgeParams } from '@/types/consult'
import { getKnowledgePage } from '@/api/consultApi'

const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])

const props = defineProps<{
  type: KnowledgeType
}>()

const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})

const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  console.log(params.value)
  console.log(res)
  list.value.push(...res.data.rows)
  // 判断数据是否加载完成
  if (list.value.length >= res.data.total) {
    // 数据加载完成,显示没有更多了
    finished.value = true
  } else {
    params.value.current++
  }
  // 结束加载
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
