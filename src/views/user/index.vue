<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserInfo } from '@/types/user'
import { getUserInfo } from '@/api/userApi'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'

const router = useRouter()
// 钩子函数只能在 setup 函数里面使用
const store = useUserStore()

const userData = ref<UserInfo>()
const fetchUserInfo = async () => {
  const { data } = await getUserInfo()
  userData.value = data
}

const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]

// 退出登录
const logout = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确定要退在线问诊吗?'
  })
  // 清除 token
  store.delUser()
  router
  // 路由跳转
  router.push('/login')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="user-page">
    <!-- 头部布局 -->
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="userData?.avatar" />
        <div class="name">
          <p>{{ userData?.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ userData?.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ userData?.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ userData?.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ userData?.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <!-- 订单情况 -->
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/user/consult">全部订单 <van-icon name="arrow" /></router-link>
      </div>
      <van-row v-if="userData?.orderInfo">
        <van-col span="6">
          <cp-icon class="icon" name="user-paid" />
          <p>待付款 {{ userData.orderInfo.paidNumber }}</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-shipped" />
          <p>待发货 {{ userData.orderInfo.receivedNumber }}</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-received" />
          <p>待收货 {{ userData.orderInfo.shippedNumber }}</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-finished" />
          <p>已完成{{ userData.orderInfo.finishedNumber }}</p>
        </van-col>
      </van-row>
    </div>
    <!-- 快捷工具 -->
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        v-for="(item, i) in tools"
        :key="item.label"
        :title="item.label"
        :to="item.path"
        is-link
        :border="false"
      >
        <template #icon><cp-icon :name="`user-tool-0${i + 1}`" /></template>
      </van-cell>
    </div>
    <a class="logout" href="javascript:;" @click="logout">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;

  // 头部
  &-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(40, 100, 204, 0.46), rgba(146, 171, 242, 0));
    margin: 0 -15px;
    padding: 0 15px;

    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;

      .van-image {
        width: 70px;
        height: 70px;
      }

      .name {
        padding-left: 10px;

        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }

          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }

    .van-row {
      margin: 0 -15px;
      padding-top: 15px;

      p {
        text-align: center;

        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }

        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }

  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;

    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;

      a {
        color: var(--cp-tip);
      }
    }

    .van-col {
      text-align: center;

      cp-icon {
        width: 1.5rem;
        height: 1.5rem;
      }

      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }

  // 分组
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    h3 {
      padding-left: 16px;
      line-height: 44px;
    }

    :deep() {
      .van-cell {
        align-items: center;
        .van-cell__title {
          margin-left: 10px;
        }
        .container {
          margin-top: 4px;
        }
      }
    }
  }
  // 退出
  .logout {
    display: block;
    margin: 20px auto;
    width: 100px;
    text-align: center;
    color: var(--cp-price);
  }
}
</style>
