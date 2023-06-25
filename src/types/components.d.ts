import CpNavBar from '@/components/cp-nav-bar.vue'
import CpIcon from '@/components/cp-icon.vue'
import CpRadioBtn from '@/components/cp-radio-btn'
import CpPaySheet from '@/components/cp-pay-sheet.vue'
// 声明 vue 类型模块
declare module 'vue' {
  // 给 vue 添加全局组件类型 类型合并 在 vue 的类型中会增加 这个组件类型.
  interface GlobalComponents {
    // 定义具体组件类型,使用 typeof 获取到组件实例类型
    // typeof 作用是得到对应的 TS 类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpPaySheet: typeof CpPaySheet
  }
}
