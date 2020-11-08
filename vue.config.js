const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}
/* 
    Vue 文件中引入
        import my from "views/my/My.vue";
    注意，引用别名时如果是HTML中的路径，则需要在别名前面加符号~
        <img src="~assets/img/tabbar/home.svg" alt="" slot="item-icon">
*/
module.exports = {
    // 配置别名
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('assets', resolve('./src/assets'))
    },
    // 开启浏览器调试功能，然后在需要调试的代码打 debugger
    configureWebpack: {
        devtool: '#eval-source-map'
    },
}