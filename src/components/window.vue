<template>
  <div
    @click.stop="winCancelBubble($event)"
    v-show="m_show"
    :id="id"
    :class="getClass()"
    @mousedown="bringToFront"
  >
    <div class="theone-window-inner" @mousedown="bringToFront">
      <!--点击 header 的时候才可以拖动-->
      <div
        class="theone-window-header"
        :class="{ 'wo-win-dragable': m_sizeMode == 'normal' && dragable }"
        @mouseover="initDragable"
        @mousedown="bringToFront"
      >
        <img :src="iconUrl" v-show="iconUrl && iconUrl.length > 0" alt="图标" />
        <span>{{ title }}</span>
        <span class="theone-window-toolbar" @mousedown="cancelBubble">
          <!--头部工具条插槽-->
          <slot name="toolbar"></slot>
          <span>
            <i
              :title="m_sizeMode == 'normal' ? '全屏' : '退出全屏'"
              v-on:click="onMaxOrRestoreClick"
              v-show="maxsizeable"
              :class="{
                'theone-icon-font': true,
                'theone-icon-max': m_sizeMode == 'normal',
                'theone-icon-normal': m_sizeMode != 'normal',
              }"
            ></i>
            &ensp;
            <i
              title="关闭窗口"
              v-on:click="onCloseClick"
              v-show="closeable"
              class="theone-icon-font theone-icon-close theone-window-close-button"
            ></i>
          </span>
        </span>
      </div>
      <div class="theone-window-body">
        <!--窗口内容插槽-->
        <slot name="body"></slot>

        <!--如果存在 url 则生成一个 iframe -->
        <div
          :class="{
            'theone-window-loading': m_isLoading,
            'theone-window-loading-hidden': !m_isLoading,
          }"
        >
          <slot name="loading"><span>正在加载...</span></slot>
        </div>
        <iframe
          @load="docLoad"
          @error="docError"
          class="theone-window-iframe"
          v-if="url && url != ''"
          :src="url"
          frameborder="0"
        ></iframe>
      </div>
    </div>

    <span
      @mousedown="bringToFront"
      v-show="resizable && m_sizeMode == 'normal'"
      :class="{
        'theone-window-resize-bar': true,
        'wo-left-nwse-resize': dragDirection == 'left',
        'wo-right-nesw-resize': dragDirection == 'right',
      }"
      @mouseover="initResizable"
    >
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
Vue.prototype.$windows = []
export default {
  data: function () {
    return {
      m_show: this.show,      // 当前窗口是否显示
      m_sizeMode: 'normal',   // 当前窗口的模式
      m_storeStyle: {
        width: '',
        height: '',
        left: '',
        top: '',
      },
      m_zIndex: this.minZIndex,  // 当前窗口的 zindex
      //记录相对于初始位置平移的偏移量
      translate: {
        x: 0,
        y: 0,
      },
      m_isLoading: this.loading,  // 窗口是否正在加载
    }
  },
  computed: {
    zIndex: {
      set: function (newVal) {
        this.m_zIndex = newVal
        this.$el.style.zIndex = this.zIndex
      },
      get: function () {
        return this.m_zIndex
      },
    },
  },
  props: {
    // 最小索引
    minZIndex: {
      type: Number,
      default: 9999,
    },
    // 窗口 id
    id: String,
    //窗口图标
    iconUrl: String,
    //窗口标题
    title: {
      type: String,
      default: '标题',
    },
    /**
     * 内部 iframe(class为theone-window-iframe)显示url指定的页面
     */
    url: String,
    //是否可见
    show: Boolean,
    //是否可以调整大小
    resizable: {
      type: Boolean,
      default: true,
    },
    //是否可以拖拽移动
    dragable: {
      type: Boolean,
      default: true,
    },
    //是否显示关闭按钮
    closeable: {
      type: Boolean,
      default: true,
    },
    // 可否可以最大化
    maxsizeable: {
      type: Boolean,
      default: true,
    },
    // 是否可以最小化
    minsizeable: {
      type: Boolean,
      default: false,
    },
    // 正在加载
    loading: Boolean,
    // 拖动方向
    dragDirection: {
      type: String,
      default: 'left',
    },
  },
  methods: {
    /**
     *功能：使给定的元素dragObj成为可拖动的组件,并实现当窗体大小改变时保证组件始终在窗口可见范围内
     *@param {HTMLElement}windowHeader 鼠标在此元素按下按键时开始拖动
     *@param {HTMLElement}windowContainer 实际拖动的的元素
     *@memberof MeteoLib.Widgets
     */
    _dragable: function (windowHeader, windowContainer) {
      var _this = this

      // 如果已经初始化过就结束
      if (windowHeader.__dragableInit) {
        return
      }
      windowHeader.__dragableInit = true

      // windowHeader.style.cursor = "move";
      windowHeader.style['pointer-events'] = 'unset'
      var mouseIsDowned = false //判断鼠标是否按下过

      // 表示 鼠标按下时,鼠标点击位置到当前点击元素左侧边界的距离
      var leftDistance = 0,
        topDistance = 0
      // 找一个父容器
      function findContainer(node) {
        // 如果该节点 clientHeight 和 clientWidth 都不是 0 则将该元素作为父元素
        if (
          (node.clientHeight != 0 && node.clientWidth != 0) ||
          !node.parentNode
        ) {
          return node
        }
        // 否则继续向上找父元素
        if (node.parentNode) {
          return findContainer(node.parentNode)
        }
      }
      // 找到当前窗口的父容器之后，当前窗口的移动范围在父容器内
      // 这里找的是 app 作为容器
      var container = findContainer(windowContainer.parentNode)

      // 鼠标按下事件
      function mouse_down(windowContainer) {
        document.body.style.cursor = 'move'
        // window.event.clientX 鼠标在浏览器窗口的位置
        // this.translate.x  当前窗口的平移距离
        //  windowContainer.offsetLeft，obj 元素距离父元素的左侧距离, windowContainer 是当前容器窗口

        // leftDistance,topDistance 表示鼠标点击时，鼠标点距离当前点击窗口左侧边界的距离
        leftDistance =
          window.event.clientX - (_this.translate.x + windowContainer.offsetLeft)
        topDistance = window.event.clientY - (_this.translate.y + windowContainer.offsetTop)

        // windowContainer.style.position = "absolute";
        mouseIsDowned = true // 标记已经点击过
        document.body.addEventListener('mousemove', handleMove)
        // 回调开始拖动组件时触发的函数
        _this.$emit('dragstart')
      }

      // 触发鼠标移动事件
      function handleMove(e) {
        if (mouseIsDowned) {
          mouse_move(windowContainer)
          e.preventDefault()
        }
      }
      // 鼠标移动事件触发时执行的函数
      // window-container 节点对象
      function mouse_move(windowContainerNode) {
        if (mouseIsDowned) {
          // 表示窗口要去的坐标，= 鼠标当前坐标 - 鼠标距离当前窗口左侧的距离
          var goX = window.event.clientX - leftDistance
          var goY = window.event.clientY - topDistance
          // 窗口左上角可以到达的最大 x,y 值，
          // offsetWidth 是对象的可见宽度
          var maxX = container.clientWidth - windowContainerNode.offsetWidth
          var maxY = container.clientHeight - windowContainerNode.offsetHeight

          goX = goX < 0 ? 0 : goX
          goX = goX > maxX ? maxX : goX
          goY = goY < 0 ? 0 : goY
          goY = goY > maxY ? maxY : goY

          // offsetLeft，offsetTop 是对象的固定值，类似于 padding-left,和padding-top
          // 更新窗口平移的 x,y
          _this.translate.x = goX - windowContainerNode.offsetLeft
          _this.translate.y = goY - windowContainerNode.offsetTop

          windowContainerNode.style.transform =
            'translate(' + _this.translate.x + 'px,' + _this.translate.y + 'px)'
        }
      }

      // 鼠标按下过，现在鼠标在窗口移动触发的事件
      function mouse_up(windowContainer) {
        if (mouseIsDowned) {
          document.body.removeEventListener('mousemove', handleMove)

          // event.clientX 鼠标移动时鼠标相对于浏览器窗口可视区域的X，Y坐标（窗口坐标），可视区域不包括工具栏和滚动条,也就是鼠标的当前位置
          // 当前窗口的位置 = 当前鼠标位置 - 鼠标点击位置到点击元素左侧的距离
          var goX = window.event.clientX - leftDistance
          var goY = window.event.clientY - topDistance

          // // element.clientWidth，element.clientHeight 表示 元素 content 的宽和高
          // windowContainer.offsetWidth 是对象的可见宽度，包滚动条等边线，会随窗口的显示大小改变
          var maxX = container.clientWidth - windowContainer.offsetWidth
          var maxY = container.clientHeight - windowContainer.offsetHeight
          //var maxX = document.documentElement.clientWidth - windowContainer.offsetWidth;
          //var maxY = document.documentElement.clientHeight - windowContainer.offsetHeight;

          // 计算元素当前坐标位置，如果小于0 或者大于最大值就写成最大值或者 0
          goX = goX < 0 ? 0 : goX
          goX = goX > maxX ? maxX : goX
          goY = goY < 0 ? 0 : goY
          goY = goY > maxY ? maxY : goY

          _this.translate.x = goX - windowContainer.offsetLeft
          _this.translate.y = goY - windowContainer.offsetTop

          // 当前窗口平移距离
          windowContainer.style.transform =
            'translate(' + _this.translate.x + 'px,' + _this.translate.y + 'px)'
          // margin 是 0
          windowContainer.style.marginTop = windowContainer.style.marginLeft = 0
          // 光标恢复默认
          document.body.style.cursor = 'default'
          mouseIsDowned = false
          // 回调拖动结束
          _this.$emit('dragend')
        }
      }

      windowHeader.addEventListener('mousedown', function (e) {
        if (_this.m_sizeMode == 'normal') {
          mouse_down(windowContainer)
          return _this.stopDefault(e)
        }
      })
      windowHeader.onmousedown = function (e) {
        if (_this.m_sizeMode == 'normal') {
          mouse_down(windowContainer)
          return _this.stopDefault(e)
        }
      }

      document.body.addEventListener('mouseup', function (e) {
        if (mouseIsDowned) {
          mouse_up(windowContainer)
          return _this.stopDefault(e)
        }
      })

      document.body.addEventListener('mouseleave', function (e) {
        if (mouseIsDowned) {
          mouse_up(windowContainer)
          return _this.stopDefault(e)
        }
      })
      // 窗口改变尺寸触发的函数
      window.addEventListener('resize', function () {
        if (windowContainer.style.right == 'unset') {
          var right = windowContainer.offsetLeft + windowContainer.clientWidth
          if (right >= document.body.clientWidth) {
            windowContainer.style.left = document.body.clientWidth - windowContainer.clientWidth + 'px'
          }
        }
        if (windowContainer.style.bottom == 'unset') {
          var bottom = windowContainer.offsetTop + windowContainer.clientHeight
          if (bottom >= document.body.clientHeight) {
            windowContainer.style.top = document.body.clientHeight - windowContainer.clientHeight + 'px'
          }
        }
      })
    },
    stopDefault(e) {
      window.event ? (e.returnValue = false) : e.preventDefault()
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
      return false
    },
    _getStyle: function (windowContainer, attr) {
      if (windowContainer.currentStyle) {
        return windowContainer.currentStyle[attr]
      } else {
        return document.defaultView.getComputedStyle(windowContainer, null)[attr]
      }
    },
    /**
     * 实现拖拽resizeBarObj改变resizeObj元素的大小
     * @param {HTMLElement} resizeBarObj
     * @param {HTMLElement} resizeObj
     */
    _resizable: function (resizeBarObj, resizeObj) {
      if (resizeBarObj.__resizableInit) {
        return
      }

      resizeBarObj.__resizableInit = true
      var windowContainer = resizeObj
      var mouseIsDowned = false
      var _this = this

      var getStyle = this._getStyle

      function mouse_down(windowContainer) {
        console.log(windowContainer)
        if (resizeBarObj.className.indexOf('wo-right-nesw-resize') >= 0) {
          document.body.style.cursor = 'nesw-resize'
        } else {
          document.body.style.cursor = 'nwse-resize'
        }

        mouseIsDowned = true
        _this.$emit('resizestart')
      }

      function mouse_up(windowContainer) {
        console.log(windowContainer)

        mouseIsDowned = false
        document.body.style.cursor = 'default'
        if (mouseIsDowned) {
          _this.$emit('resizeend')
        }
      }

      var marginCorrect = 30

      function mouse_move(windowContainer) {
        console.log(windowContainer)

        var reactObj = resizeObj.getBoundingClientRect()
        reactObj.paddingTop = getStyle(resizeObj, 'paddingTop')
        reactObj.paddingLeft = getStyle(resizeObj, 'paddingLeft')
        reactObj.paddingRight = getStyle(resizeObj, 'paddingRight')
        reactObj.paddingBottom = getStyle(resizeObj, 'paddingBottom')

        reactObj.marginTop = getStyle(resizeObj, 'marginTop')
        reactObj.marginLeft = getStyle(resizeObj, 'marginLeft')
        reactObj.marginRight = getStyle(resizeObj, 'marginRight')
        reactObj.marginBottom = getStyle(resizeObj, 'marginBottom')

        var w, h
        // if (resizeBarObj.className.indexOf('wo-right-nesw-resize') >= 0) {
        //     document.body.style.cursor = "nesw-resize";
        //     var x = Math.min(window.event.clientX, reactObj.right - marginCorrect);
        //     var y = Math.max(window.event.clientY, reactObj.top + marginCorrect);
        //     w = reactObj.right - x;
        //     h = y - reactObj.top;

        //     resizeObj.style.left = (x - w) + "px";

        //     w = w + "px"
        //     h = h + "px"

        //     //w = "calc(" + w + "px" + " - " + reactObj.paddingLeft + " - " + reactObj.marginLeft + ")";

        //     resizeObj.style.right = "unset";
        //     resizeObj.style.right = reactObj.right + "px";
        //     // resizeObj.style.left ="unset";
        //     //resizeObj.style.width = w
        //     resizeObj.style.height = h

        // } else {
        document.body.style.cursor = 'nwse-resize'
        var x = Math.max(window.event.clientX, reactObj.left + marginCorrect)
        var y = Math.max(window.event.clientY, reactObj.top + marginCorrect)
        w = x - reactObj.left
        h = y - reactObj.top
        var hs = [
          reactObj.paddingTop,
          reactObj.marginTop,
          // ,reactObj.paddingBottom
          // ,reactObj.marginBottom
        ]
        var ws = [
          reactObj.paddingLeft,
          reactObj.marginLeft,
          // ,reactObj.paddingRight,
          // ,reactObj.marginRight
        ]

        h = 'calc(' + h + 'px - ' + hs.join(' - ') + ')'
        w = 'calc(' + w + 'px - ' + ws.join(' - ') + ')'
        resizeObj.style.width = w
        resizeObj.style.height = h
        // }
      }
      resizeBarObj.addEventListener('mousedown', function (e) {
        mouse_down(windowContainer)
        e.preventDefault()
      })
      resizeBarObj.onmousedown = function (e) {
        mouse_down(windowContainer)
        e.preventDefault()
      }

      document.body.addEventListener('mouseup', function (e) {
        if (mouseIsDowned) {
          mouse_up(windowContainer)
          e.preventDefault()
        }
      })

      document.body.addEventListener('mousemove', function (e) {
        if (mouseIsDowned) {
          mouse_move(windowContainer)
          e.preventDefault()
        }
      })
    },
    // 关闭窗口
    onCloseClick: function (e) {
      this.m_show = false
      this.$emit('visibleChanged', this, this.m_show)
      this.$emit('close', this)
      return this.stopDefault(e)
    },

    // 找到 类名是 className 的节点，然后返回
    findParentNode: function (node, className) {
      var _this = this
      if (node.className.indexOf(className) >= 0) {
        return node
      } else if (node.parentNode) {
        return _this.findParentNode(node.parentNode, className)
      }
    },

    //最大化或者还原
    onMaxOrRestoreClick: function (e) {
      var node = this.findParentNode(
        e.currentTarget.parentNode,
        'theone-window-container'
      )
      if (this.m_sizeMode == 'maximum') {
        this.m_sizeMode = 'normal'
        node.style.width = this.m_storeStyle.width
        node.style.height = this.m_storeStyle.height
        node.style.top = this.m_storeStyle.top
        node.style.left = this.m_storeStyle.left
        node.style.transform =
          'translate(' + this.translate.x + 'px,' + this.translate.y + 'px)'
      } else {
        var reactObj = node.getBoundingClientRect()
        reactObj.paddingTop = this._getStyle(node, 'paddingTop')
        reactObj.paddingLeft = this._getStyle(node, 'paddingLeft')
        reactObj.paddingRight = this._getStyle(node, 'paddingRight')
        reactObj.paddingBottom = this._getStyle(node, 'paddingBottom')
        reactObj.borderWidth = this._getStyle(node, 'borderWidth')

        this.m_storeStyle.width = node.style.width
        this.m_storeStyle.height = node.style.height
        this.m_storeStyle.left = node.style.left
        this.m_storeStyle.top = node.style.top

        var hs = [
          reactObj.paddingTop,
          reactObj.marginTop,
          reactObj.paddingBottom,
          reactObj.marginBottom,
          reactObj.borderWidth,
        ].map(function (item) {
          if (item) return item
          else return '0px'
        })
        var ws = [
          reactObj.paddingLeft,
          reactObj.marginLeft,
          reactObj.paddingRight,
          reactObj.marginRight,
          reactObj.borderWidth,
        ].map(function (item) {
          if (item) return item
          else return '0px'
        })

        var h = 'calc(100% - ' + hs.join(' - ') + ')'
        var w = 'calc(100% - ' + ws.join(' - ') + ')'
        node.style.width = w
        node.style.height = h
        node.style.left = '0'
        node.style.top = '0'

        node.style.transform = 'translate(0px,0px)'

        this.m_sizeMode = 'maximum'
      }
      return this.stopDefault(e)
    },
    // 最小化
    onMinClick: function (e) {
      this.m_sizeMode = 'minimum'
      return this.stopDefault(e)
    },
    // 初始化可放大缩小
    initResizable: function (e) {
      var parentNode = this.findParentNode(
        e.currentTarget.parentNode,
        'theone-window-container'
      )
      this._resizable(e.currentTarget, parentNode)
    },
    // 初始化可拖动事件
    initDragable: function (e) {
      // 如果开启了鼠标拖动事件
      if (this.dragable) {
        // 找到当前鼠标事件节点的类名是 theone-window-container 的父节点，也就是找到容器节点
        var parentNode = this.findParentNode(
          e.currentTarget.parentNode,
          'theone-window-container'
        )
        // 第一个参数是鼠标按住可以拖动的元素，这里是 wo-header，第二个元素是 容器元素，也就是鼠标拖动的时候，移动的父元素
        this._dragable(e.currentTarget, parentNode)
      }
    },
    // 获取 class
    getClass: function () {
      return [
        'theone-window-container',
        {
          'theone-window-fullscreen': this.m_sizeMode == 'maximum',
        },
      ]
    },
    // 点击窗口的元素时，将当前窗口放置到最前面
    bringToFront: function () {
      var _this = this
      this.$windows.forEach(function (win) {
        // 遍历所有窗口，如果索引大于当前窗口，就把大的zindex 赋值给当前窗口，交换 zindex
        if (_this != win && win.zIndex > _this.zIndex) {
          var temp = win.zIndex
          win.zIndex = _this.zIndex
          _this.zIndex = temp
        }
      })
    },
    // iframe 文档加载
    docLoad: function (e) {
      this.m_isLoading = false
      try {
        console.log(e.currentTarget.contentWindow.name)
      } catch (error) {
        var body = this.findParentNode(e.currentTarget, 'theone-window-body')
        var bgColor = this._getStyle(body, 'backgroundColor')
        if (!bgColor || bgColor == '' || bgColor == 'rgba(0, 0, 0, 0)') {
          body.style.backgroundColor = 'white'
        }
      }
      this.$emit('docload', this, e)
      console.log('doc load', this.url)
    },
    // iframe 文档加载错误
    docError: function (e) {
      this.m_isLoading = false
      this.$emit('docerror', this, e)
    },
    // 销毁组件方法
    destroy: function () {
      this.$el.parentNode.removeChild(this.$el)
      this.$destroy()
      for (var key in this) {
        //  this.hasOwnProperty(key) 不用这个判断，因为有可能被重写
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          delete this[key]
        }
      }
      this.__destroyed = true
    },
    //cancelBubble,阻止事件冒泡,在头部使用
    cancelBubble: function (e) {
      return this.stopDefault(e)
    },
    // 取消冒泡
    winCancelBubble: function (e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
      return false
    },
  },
  mounted: function () {
    // 找到最大的 zindex,新加载的这个组件 zindex = maxZindex + 1
    // 目的是为了新的组件显示在最上面
    var maxZindex = this.zIndex
    this.$windows.forEach(function (win) {
      maxZindex = Math.max(win.zIndex, maxZindex)
    })
    this.zIndex = maxZindex + 1
    this.$windows.push(this)

    // 如果 url 不为空则加载 url
    if (this.url && this.url != '') {
      this.m_isLoading = true
      this.$emit('loadstart', this)
    }
  },

  watch: {
    // show 发生变化
    show: function (newVal) {
      this.m_show = newVal
      this.$emit('visibleChanged', this, newVal)
      if (!newVal) {
        this.$emit('close', this)
      } else {
        this.bringToFront()
      }
    },
    // 改变 url
    url: function (newVal) {
      if (newVal) {
        this.m_isLoading = true
      } else {
        this.m_isLoading = false
      }
    },
    // 改变正在加载
    loading: function (newVal) {
      this.m_isLoading = newVal
    },
  },
  name: 'theone-window',
}
</script>
<style lang="scss">
@import '../styles/common/index.scss';
@import '../styles/window.scss';
</style>