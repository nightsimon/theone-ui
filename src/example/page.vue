<template>
  <div>
    <theone-window
      :is-loading="isLoading"
      @close="onClose"
      title="表格使用示例"
      :show="true"
      style="left: 500px; top: 100px;height:500px;"
    >
      <div
        slot="body"
        style="width: 100%; padding-top: 0.5em; padding-bottom: 0.5em"
      >
        <theone-page
          previous-button=" 上一页 "
          next-button=" 下一页 "
          @change="pageChange"
          :page-size="pageSize"
          :page-count="10"
          :total="total"
          :page-index="pageIndex"
        ></theone-page>
      </div>
    </theone-window>
  </div>
</template>

<script>
export default {
  name: 'test-page',
  components: {},
  data() {
    return {
      tableData: null,

      pageIndex: 1,
      pageCount: 10,
      pageSize: 20,
      total: 200,
      isLoading: false,
      operation: [
        {
          name: '编辑',
          cssClass: 'wo-win-iconfont icon-xiugai',
          action: function (row) {
            alert('打开编辑功能' + row)
          },
        },
        {
          name: '',
          cssClass: 'wo-win-iconfont icon-shanchu',
          action: function (row) {
            alert('执行删除操作' + row)
          },
        },
        {
          name: '预览',
          cssClass: 'wo-butn wo-win-iconfont icon-yulan',
          action: function (row) {
            alert('打开预览窗口' + row)
          },
        },
        {
          name: '查看',
          action: function (row) {
            alert('查看', row)
          },
        },
      ],
    }
  },
  methods: {
    selectedRowsChange: function (rowsSelected) {
      console.log('多选' + rowsSelected)
    },
    pageChange: function (pageIndex, pageSize) {
      console.log(pageIndex + ',' + pageSize)
    },
    onClose: function () {
      console.log('window close')
    },
  },
}
</script>

<style lang="scss">
</style>
