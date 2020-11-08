/**
 * 插件入口
 */
// import Button from './Button'
// import Icon from './Icon'
// Vue.use() 的时候会执行 Install 方法
const install = (Vue) => {


  // 注册全局组件
  // Vue.component(Button.name, Button)
  // Vue.component(Icon.name, Icon)

  // 通过 webpack api 自动引入组件名称
  // webpack 的 require.context() 符合前端工程化
  // require 是 webpack 的全局对象
  // 第一个参数是 匹配当前目录，第二个参数是查找所有文件， 第三个参数是查找以 .vue 结尾的文件
  const requireComponent = require.context('.', true, /\.vue/)
  //  requireComponent.keys() 就是所有的文件名数组
  // console.log('requireComponent', requireComponent.keys())
  requireComponent.keys().forEach((fileName) => {
    // component 是一个组件 例如这里的 button, 也相当与一个 button.vue 文件
    const component = requireComponent(fileName)
    console.log('component', component)
    // component.default.name 组件名称 ， component.default 组件
    Vue.component(component.default.name, component.default)
  })
}

export default {
  install,
}