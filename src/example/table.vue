<template>
  <div>
    <theone-window
      :loading="isLoading"
      @close="onClose"
      title="表格使用示例"
      :show="true"
      style="left: 500px; top: 100px"
    >
      <theone-table
        slot="body"
        @selectedrowschange="selectedRowsChange"
        :table-data="tableData"
        :select-on-click="true"
        :checkbox="true"
        :operation="operation"
      >
      </theone-table>

      <div
        slot="body"
        style="width: 100%; padding-top: 0.5em; padding-bottom: 0.5em"
      >
        <theone-page
          previous-button=" 上一页 "
          next-button=" 下一页 "
          @change="pageChange"
          :page-size="pageSize"
          :page-count="pageCount"
          :total="total"
          :page-index="pageIndex"
        ></theone-page>
      </div>
      <div slot="loading">
        <img
          style="width: 2em"
          src="@/assets/Images/ajax-loader.gif"
          alt="正在加载..."
        /><span>正在加载...</span>
      </div>
    </theone-window>
  </div>
</template>

<script>
export default {
  name: 'test-table',
  components: {},
  data() {
    return {
      tableData: null,
      pageIndex: 1,
      pageCount: 1,
      pageSize: 10,
      total: 200,
      isLoading: true,
      operation: [
        {
          name: '编辑',
          cssClass: 'wo-butn theone-icon-font theone-icon-update',
          action: function (row) {
            alert('打开编辑功能' + row)
          },
        },
        {
          name: '删除',
          cssClass: 'wo-butn theone-icon-font theone-icon-delete',
          action: function (row) {
            alert('执行删除操作' + row)
          },
        },
        {
          name: '预览',
          cssClass: 'wo-butn theone-icon-font theone-icon-preview',
          action: function (row) {
            alert('打开预览窗口' + row)
          },
        },
        {
          name: '查看',
          cssClass: 'wo-butn',
          action: function (row) {
            alert('查看', row)
          },
        },
      ],
    }
  },
  methods: {
    // table 中回调，选择的行发生了变化
    selectedRowsChange: function (rowsSelected) {
      console.log("多选",rowsSelected)
    },
    pageChange: function (pageSize, pageIndex) {
      console.log(`pageIndex:${pageIndex} ,pageSize:${pageSize}`)
    },
    onClose: function () {
      console.log('window close')
    },
  },
  mounted() {
    let _this = this
    setTimeout(async function () {
      _this.tableData = {
        rows: [],
        columns: [
          {
            _id: '5d7f7894134eaa1e24c0d8b8',
            name: '_userCountyCode',
            nameCn: '所属县级行政区划编码',
            type: 'number',
            tableId: '5d7f7894134eaa1e24c0d8b7',
            cTime: '2019-09-16T11:57:08.352Z',
            description: '所属县级行政区划编码',
            mTime: '2019-09-16T11:57:08.352Z',
            mUser: '',
            cUser: '',
            isRequired: true,
            isUnique: false,
            isPrimaryKey: false,
            isCaseSensitive: false,
            defaultValue: null,
            nodataValue: null,
            validRange: null,
            unit: '',
            valueOptions: null,
            group: null,
            visible: true,
            editable: false,
          },
          {
            _id: '5d7f7894134eaa1e24c0d8b9',
            name: '_userCountyName',
            nameCn: '所属县级行政区划名称',
            type: 'text',
            tableId: '5d7f7894134eaa1e24c0d8b7',
            cTime: '2019-09-16T11:57:08.352Z',
            description: '所属县级行政区划名称',
            mTime: '2019-09-16T11:57:08.352Z',
            mUser: '',
            cUser: '',
            isRequired: true,
            isUnique: false,
            isPrimaryKey: false,
            isCaseSensitive: false,
            defaultValue: null,
            nodataValue: null,
            validRange: null,
            unit: '',
            valueOptions: null,
            group: null,
            visible: true,
            editable: false,
          },
          {
            _id: '5d7f78f0134eaa1e24c0d8bd',
            name: 'name',
            nameCn: '目录名称',
            type: 'text',
            tableId: '5d7f7894134eaa1e24c0d8b7',
            cTime: '2019-09-16T11:58:40.536Z',
            description: '目录名称',
            mTime: '2019-09-16T11:58:40.536Z',
            mUser: '',
            cUser: '',
            isRequired: true,
            isUnique: true,
            isPrimaryKey: true,
            isCaseSensitive: true,
            defaultValue: '',
            nodataValue: 'undefined',
            validRange: null,
            unit: '',
            valueOptions: null,
            group: '',
            visible: 'true',
            editable: 'true',
            ref: null,
          },
          {
            _id: '5d7f7907134eaa1e24c0d8be',
            name: 'absoluteDir',
            nameCn: '物理路径',
            type: 'text',
            tableId: '5d7f7894134eaa1e24c0d8b7',
            cTime: '2019-09-16T11:59:03.885Z',
            description: '在服务器上的物理路径',
            mTime: '2019-09-16T11:59:03.885Z',
            mUser: '',
            cUser: '',
            isRequired: true,
            isUnique: false,
            isPrimaryKey: false,
            isCaseSensitive: true,
            defaultValue: '',
            nodataValue: 'undefined',
            validRange: null,
            unit: '',
            valueOptions: null,
            group: '',
            visible: 'true',
            editable: 'true',
            ref: null,
          },
          {
            _id: '5d7f791a134eaa1e24c0d8bf',
            name: 'description',
            nameCn: '描述',
            type: 'text',
            tableId: '5d7f7894134eaa1e24c0d8b7',
            cTime: '2019-09-16T11:59:22.362Z',
            description: '描述',
            mTime: '2019-09-16T11:59:22.362Z',
            mUser: '',
            cUser: '',
            isRequired: false,
            isUnique: false,
            isPrimaryKey: false,
            isCaseSensitive: true,
            defaultValue: '',
            nodataValue: 'undefined',
            validRange: null,
            unit: '',
            valueOptions: null,
            group: '',
            visible: 'true',
            editable: 'true',
            ref: null,
          },
        ],
      }
      let { data: ret } = await _this.$http.get('/static/data/table.json')
      console.log(ret)
      _this.tableData.rows = ret.slice(0, 10)
      _this.total = ret.length
      _this.isLoading = false
      _this.pageCount = Math.ceil(_this.total / _this.pageSize)
      _this.pageCount = 100
    }, 2000)
  },
}
</script>

<style>
</style>
