// 该文件负责所有的公共的组件的全局注册   Vue.use
import ToolBar from '@/components/ToolBar'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('ToolBar', ToolBar)
  }
}
// 可以是函数也可以是对象 对象必须要有install方法

// export default function (Vue) {
//   Vue.component('ToolBar.name', ToolBar)
// }