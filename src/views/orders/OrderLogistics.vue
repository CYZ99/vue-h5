<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Logistics } from '@/types/medicine'
import { getMedicalOrderLogistics } from '@/api/medicineApi'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'

import startIcon from '@/assets/start.png'
import endIcon from '@/assets/end.png'
import currentIcon from '@/assets/car.png'

const route = useRoute()

// 1. 定义数据接收异步请求返回的数据
const logistics = ref<Logistics>()
// 获取物流数据
const getOrderLogistics = async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
  console.log(res.data)
}
onMounted(() => {
  getOrderLogistics()
})

// 配置高德地图安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '28011869aeec117a756414716381c9df'
}

// 初始化地图
onMounted(async () => {
  // 1. 加载地图
  const AMap = await AMapLoader.load({
    key: '559180ee65b92c953b3d86844a00d469',
    version: '2.0'
  })
  // 2. 创建地图
  const map = new AMap.Map('map', {
    viewMode: '2D', // 默认使用 2D 模式
    zoom: 12, //初始化地图的缩放级别 2-20 值越小,显示的范围越大
    center: [116.397428, 39.90923] //初始化地图中心点
  })
  // 3.使用插件绘制轨迹信息
  AMap.plugin(['AMap.Driving'], function () {
    const driving = new AMap.Driving({
      map: map,
      showTraffic: false,
      hideMarkers: true
    })
    if (logistics.value?.logisticsInfo && logistics.value.logisticsInfo.length >= 2) {
      const list = [...logistics.value.logisticsInfo]
      // 起点
      const start = list.shift()
      // 终点
      const end = list.pop()
      // 4. 自定义起始点和终点的图标
      const startMaker = new AMap.Marker({
        position: [start?.longitude, start?.latitude],
        icon: startIcon,
        map: map
      })
      const endMaker = new AMap.Marker({
        position: [end?.longitude, end?.latitude],
        icon: endIcon,
        map: map
      })
      driving.search(
        // 起点
        [start?.longitude, start?.latitude],
        // 终点
        [end?.longitude, end?.latitude],
        // 经过的点
        { waypoints: list.map((item) => [item.longitude, item.latitude]) },
        // 是否成功的状态的回调
        (status: string, result: object) => {
          // 规划完毕
          console.log(status, result)
          if (status === 'complete') {
            console.log('绘制成功')
            // 绘制当前坐标
            const currentMaker = new AMap.Marker({
              position: [
                logistics.value?.currentLocationInfo.longitude,
                logistics.value?.currentLocationInfo.latitude
              ],
              icon: currentIcon,
              map: map
            })
            setTimeout(() => {
              map.setFitView([currentMaker, endMaker])
            }, 2000)
          }
          console.log(1111)
        }
      )
    }
  })
})
</script>

<template>
  <div class="order-logistics-page">
    <!-- 高德地图的挂载点 -->
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics?.statusValue }} 预计 {{ logistics?.estimatedTime }} 送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <!-- 物流的详情信息 -->
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="3">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}

#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;

  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    > span {
      flex: 1;
      text-align: center;
    }

    .van-icon {
      font-size: 18px;
      color: #666;

      &:last-child {
        color: var(--cp-primary);
      }
    }
  }

  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    .status {
      font-size: 15px;
      line-height: 26px;
    }

    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;

      > span {
        padding-right: 10px;
      }
    }
  }
}

.logistics {
  padding: 0 10px 20px;

  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }

  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }

    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }

    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }

    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
