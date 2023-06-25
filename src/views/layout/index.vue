<script setup lang="ts"></script>

<template>
  <div class="home">
    <van-tabbar route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/article" icon="comment-o">健康百科</van-tabbar-item>
      <van-tabbar-item to="/notify" icon="envelop-o">消息中心</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.home {
  :deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 20px;
      }

      &__text {
        font-size: 10px;
      }

      &:not(.van-tabbar-item--active) {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
