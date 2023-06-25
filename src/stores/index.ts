import { createPinia } from 'pinia'
// 1.导入数据持久化插件
import persis from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 2.注册持久化插件
pinia.use(persis)

// 3. 在 index.ts 统一导出模块的内容, 使导入时更加的方便
export * from './modules/user'
export * from './modules/consult'
export default pinia
