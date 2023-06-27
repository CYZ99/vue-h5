<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import doctorCard from './doctorCard.vue'
import type { DoctorList } from '@/types/consult'
import { getDoctorPage } from '@/api/consultApi'

const { width } = useWindowSize()
const list = ref<DoctorList>()

const getDoctorList = async () => {
  const res = await getDoctorPage({ current: 1, pageSize: 5 })
  list.value = res.data.rows
}

onMounted(() => {
  getDoctorList()
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- 这里的宽度需要做适配因为不是 px 单位的插件无法自动适配 -->
      <!-- :width="(150 / 375) * width" -->
      <van-swipe :autoplay="3000" :width="(150 / 375) * width" :showIndicators="false" loop>
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctorCard :item="item"></doctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;

  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;

    > a {
      color: var(--cp-tip);
    }
  }

  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
