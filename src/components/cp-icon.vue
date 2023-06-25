<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <div class="container">
    <svg aria-hidden="true">
      <!-- #icon-文件夹名称-图片名称 -->
      <use :href="`#icon-${name}`" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
svg {
  width: 1.25em;
  height: 1.25em;
}
</style>
