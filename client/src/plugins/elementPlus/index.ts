import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import { ElLoading, ElScrollbar } from 'element-plus'

// 需要全局注册的组件：组件名 + 组件本体
const components: Array<{ name: string; comp: any }> = [
  { name: 'ElScrollbar', comp: ElScrollbar }
]

export const setupElementPlus = (app: App<Element>) => {
  // 以插件方式注册（ElLoading 等）
  app.use(ElLoading)

  // 全局注册组件
  components.forEach(({ name, comp }) => {
    app.component(name, comp)
  })
}