import { defineStore } from 'pinia'

// 定义 user store
export const useHomeStore = defineStore('homeStore', {
  state: () => {
    return {
      counter: 0
    }
  },
  actions: {
    increment() {
      this.counter++
    }
  }
})
