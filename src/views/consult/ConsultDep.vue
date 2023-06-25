<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllDep } from '@/api/consultApi'
import type { TopDep } from '@/types/consult'
import { useConsultStore } from '@/stores'

const store = useConsultStore()
const active = ref(0)
const allDep = ref<TopDep[]>([])

onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})

// 二级科室
const subDep = computed(() => allDep.value[active.value]?.child)
</script>
<!-- 2. 极速问诊-选择科室页面 -->
<!-- 分为一级科室和二级科室,二级科室的数据与一级科室联动 -->
<!-- 一级科室的 sidebar v-model 绑定 active,二级科室遍历的数据根据一级科室绑定的 active 来索引 -->
<!-- 点击二级科室跳转到 病情描述页面 - illness,并且将选择的科室数据存放在 store 中 -->
<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <!-- 一级科室 -->
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="top in allDep" :key="top.id" :title="top.name" />
      </van-sidebar>
      <!-- 二级科室,根据一级科室动态变换 -->
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          @click="store.setDep(sub.id)"
          v-for="sub in subDep"
          :key="sub.id"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;

  &-item {
    padding: 14px;
    color: var(--cp-tag);

    &--select {
      color: var(--cp-main);
      font-weight: normal;

      &::before {
        display: none;
      }
    }
  }
}

.consult-dep-page {
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;

    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;

      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
