<script setup lang="ts">
defineProps<{
  modelValue: number
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', data: number): void
  (e: 'update:title', data: string): void
}>()
</script>

<template>
  <div class="son">
    <h2>{{ modelValue }}-{{ title }}</h2>
    <!-- 遵循单项数据流,父传子的值通过 emit 事件传递给父组件来修改 -->
    <button @click="emit('update:modelValue', 5)">变为5</button>
    <button @click="emit('update:title', 'china')">修改标题</button>
  </div>
</template>

<style lang="scss" scoped>
v.son {
  color: red;
}
</style>
