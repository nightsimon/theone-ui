<template>
  <table class="theone-table">
    <thead v-if="tableData">
      <tr>
        <td v-if="rowNumber">序号</td>
        <td v-if="checkbox">
          <theone-checkbox v-model="selectAll"></theone-checkbox>
        </td>
        <td
          :style="{ width: col.width }"
          v-for="(col, idx) in visibleColumns"
          :key="idx"
        >
          {{ col.nameCn }}
        </td>
        <td v-if="operation && operation.length">操作</td>
      </tr>
    </thead>
    <tbody v-if="tableData">
      <tr
        v-for="(row, rowIndex) in tableData.rows"
        :style="
          typeof tableData.rowStyle == 'function'
            ? tableData.rowStyle(row)
            : tableData.rowStyle
        "
        :class="
          typeof tableData.rowCssClass == 'function'
            ? tableData.rowCssClass()
            : tableData.rowCssClass
        "
        :key="rowIndex"
      >
        <td v-if="rowNumber">{{ rowIndex + 1 }}</td>
        <td v-if="checkbox">
          <theone-checkbox
            v-model="row.selected"
            @change="rowSelectedChanged(row)"
          ></theone-checkbox>
        </td>
        <td
          :style="
            typeof tableData.colStyle == 'function'
              ? tableData.colStyle(row[col.name], row, col)
              : tableData.colStyle
          "
          :class="
            typeof tableData.colCssClass == 'function'
              ? tableData.colCssClass(row[col.name], row, col)
              : tableData.colCssClass
          "
          @click="rowClick(row)"
          @dblclick="rowDblClick(row)"
          v-for="(col, idx) in visibleColumns"
          :key="idx"
        >
          {{ row[col.name] }}
        </td>
        <td class="theone-table-operation" v-if="operation && operation.length">
          <a
            v-for="(op, idx) in operation"
            :class="op.cssClass ? op.cssClass : 'wo-butn'"
            @click="op.action(row)"
            :key="idx"
            >{{ op.name }}</a
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'theone-table',
  data: function () {
    return {}
  },
  props: {
    //自定义的针对每一行的操作,比如编辑,删除等
    operation: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Object,
      default: null,
    },
    /**
     * 点击行时是否将其设置为选中,true则为选中
     */
    selectOnClick: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否启用checkbox
     */
    checkbox: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示行号
     */
    rowNumber: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // 显示的列
    visibleColumns() {
      let columns = this.tableData.columns
      let visiaColumns = columns.filter((col) => col.visible)
      console.log(visiaColumns)
      return visiaColumns
    },
    // 当前所有选择的行数
    // 计算属性有缓存的原因，这样写有问题，暂时不用计算属性
    selectedRows: {
      get() {
        if (this.tableData && this.tableData.columns && this.tableData.rows) {
          var arr = []
          this.tableData.rows.forEach(function (row) {
            if (row.selected) {
              arr.push(row)
            }
          })
          console.log('arr', arr)
          return arr
        }
        return null
      },
    },
    selectAll: {
      get: function () {
        console.log('selectAll')
        if (this.tableData && this.tableData.columns && this.tableData.rows) {
          var val = true
          this.tableData.rows.forEach(function (row) {
            val = val && row.selected
          })
          this.$emit('selectedrowschange', this.getSelectRows())
          return val
        }
        return false
      },
      set: function (newVal) {
        let _this = this
        if (this.tableData && this.tableData.columns && this.tableData.rows) {
          this.tableData.rows.forEach(function (row) {
            row.selected = newVal
            _this.$set(row, 'selected', newVal)
          })
          // 更新一下数组，不然页面无法更新
          this.tableData.rows.splice(1,0)
        }
      },
    },
  },
  methods: {
    getSelectRows() {
      if (this.tableData && this.tableData.columns && this.tableData.rows) {
        var arr = []
        this.tableData.rows.forEach(function (row) {
          if (row.selected) {
            arr.push(row)
          }
        })
        return arr
      }
      return null
    },
    rowDblClick: function (row, e) {
      console.log(e)
      this.$emit('dblclick', row)
    },
    // 点击所在行触发的事件
    rowClick: function (row) {
      console.log('rowClick  row.selected', row.selected)

      this.$emit('click', row)
      if (this.selectOnClick && this.checkbox) {
        row.selected = !row.selected
        if (row.selected) {
          this.$emit('selected', row)
        }
        this.$emit('selectedrowschange', this.getSelectRows())
      }
    },
    // 点击复选框时，checkbox 中回调该方法，
    rowSelectedChanged: function (row) {
      console.log('rowSelectedChanged-------', row.selected)
      if (row.selected) {
        this.$emit('selected', row)
      }
      this.$emit('selectedrowschange', this.getSelectRows())
    },
  },
  watch: {
    tableData: function (newVal) {
      if (newVal && newVal.columns && newVal.rows) {
        var _this = this
        if (this.checkbox) {
          newVal.rows.forEach(function (row) {
            _this.$set(row, 'selected', false)
          })
        }
      }
    },
  },
}
</script>
<style lang="scss">
@import '../styles/common/index.scss';
@import '../styles/table.scss';
</style>