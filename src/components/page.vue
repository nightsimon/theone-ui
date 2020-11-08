<template>
  <div class="theone-page">
    <div class="theone-page-left">
      <span 
        >总共<span>{{ pageCount }}</span
        >页</span
      >
      <span v-if="total != null"
        >共<span>{{ total }}</span
        >条</span
      > 
      <span>每页显示</span>
      <select v-model="m_pageSize">
        <option
          v-for="(value, index) in pageSizeArray"
          v-show="
            index == 0 ||  // 第一项显示
            total >= pageSizeArray[index - 1] ||  // 总数大于前一项的尺寸时显示
            pageSizeArray[index - 1] <= pageSize  // 总数大于前一项的尺寸时显示 
          " 
          :key="index"
        >
          {{ value }}
        </option>
      </select>
      条
    </div>
    <div class="theone-page-right">
      <ul>
        <li
          @click="previous()"
          title="上一页"
          :class="{
            'theone-page-index': true,
            disabled: 1 == currentIndex,
            'theone-page-previous-bg': previousButton == '',
          }"
        >
          {{ previousButton }}
        </li>
        <!-- 第一页一直显示 -->
        <li
          @click="goto(1)"
          v-if="pageCount > 0"
          :class="{
            'theone-page-index': true,
            'theone-page-current': 1 == currentIndex,
          }"
        >
          1
        </li>

        <li v-if="currentIndex - previousCount > 2">
          <span>...</span>
        </li>
        <li
          v-for="index in pageCountComp"
          @click="goto(index)"
          v-show="
            index == 1 ||
            index == pageCount ||
            (index >= currentIndex - previousCount &&
              index <= currentIndex + nextCount)
          "
          :class="{
            'theone-page-index': true,
            'theone-page-current': index == currentIndex,
          }"
          :key="index"
        >
          <span>{{ index }}</span>
        </li>
        <!-- 最后一页一直显示 -->
        <li v-if="pageCount > 1 && currentIndex + nextCount < pageCount">
          <span>...</span>
        </li>
        <li
          @click="goto(pageCount)"
          v-if="pageCount > 1"
          :class="{
            'theone-page-index': true,
            'theone-page-current': pageCount == currentIndex,
          }"
        >
          <span>{{ pageCount }}</span>
        </li>

        <li
          @click="next()"
          title="下一页"
          :class="{
            'theone-page-index': true,
            disabled: pageCount == currentIndex,
            'theone-page-next-bg': nextButton == '',
          }"
        >
          {{ nextButton }}
        </li>
      </ul>

      <div class="theone-page-goto">
        <div>跳转至</div>
        <div class="theone-page-goto-number">
          <input type="number" v-model="inputPageIndex" />
          <button @click="goto(inputPageIndex)">GO</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'theone-page',
  model: {
    prop: 'pageSize',
    event: 'change',
  },
  data: function () {
    return {
      inputPageIndex: this.pageCount > 0 ? '1' : '',
      currentIndex:
        this.pageCount > 0 ? (this.pageIndex ? this.pageIndex : 1) : 0,

      // 每页几条数据
      m_pageSize: this.pageSize,
    }
  },
  props: {
    //设置上一页按钮文本,如果设置,则不用背景图标
    previousButton: {
      type: String,
      default: '',
    },
    //设置下一页按钮文本,如果设置,则不用背景图标
    nextButton: {
      type: String,
      default: '',
    },
    //设置当前页码按钮之后可见的页码按钮数(不包含最后一页)
    nextCount: {
      type: Number,
      default: 3,
    },
    //设置当前页码按钮之前可见的页码按钮数(不包含第一页)
    previousCount: {
      type: Number,
      default: 3,
    },
    //获取或者设置当前页码
    pageIndex: {
      type: Number,
      default: 1,
    },
    //获取或者设置总页码数
    pageCount: {
      type: Number,
      default: 0,
    },
    //设置或获取总记录数
    total: {
      type: Number,
      default: 0,
    },
    //设置或获取每一页显示的记录数
    pageSize: {
      type: Number,
      default: 0,
    },
    //设置分页参数
    pageSizeArray: {
      type: Array,
      default: function () {
        return [5, 10, 15, 20, 30, 40, 50, 100, 150, 200, 300, 400, 500, 1000]
      },
    },
  },
  computed: {
    pageCountComp(){
      let ret = []
      let pageCount = this.pageCount
      for(let i=0;i<pageCount;i++){
        if( pageCount>0 && i>1 && i < pageCount){
          ret.push(i)
        }
      }
      return ret
    }
  },
  methods: {
    previous: function () {
      if (this.currentIndex > 1) {
        this.currentIndex -= 1
        this.$emit('change', this.m_pageSize, this.currentIndex)
      }
    },
    next: function () {
      if (this.currentIndex < this.pageCount) {
        this.currentIndex += 1
        this.$emit('change', this.m_pageSize, this.currentIndex)
      }
    },
    goto: function (currentIndex) {
      currentIndex = parseInt(currentIndex)
      if (currentIndex >= 1 && currentIndex <= this.pageCount) {
        this.currentIndex = parseInt(currentIndex)
        this.inputPageIndex = currentIndex.toString()
      } else if (currentIndex < 1) {
        this.inputPageIndex = '1'
      } else if (currentIndex > this.pageCount) {
        this.inputPageIndex = this.pageCount.toString()
      }

      this.$emit('change', this.m_pageSize, this.currentIndex)
    },
  },
  watch: {
    pageIndex: function (newVal) {
      this.currentIndex = newVal
      this.inputPageIndex = newVal.toString()
    },
    pageSize: function (newVal) {
      this.m_pageSize = newVal
    },
    m_pageSize: function (newVal) {
      console.log(newVal)
      this.$emit('change', this.m_pageSize, this.pageIndex)
    },
  },
}
</script>
<style lang="scss">
@import '../styles/common/index.scss';
@import '../styles/page.scss';
</style>