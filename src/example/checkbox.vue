<template>
  <div>
    <theone-window
      :is-loading="isLoading"
      @close="onClose"
      title="表格使用示例"
      :show="true"
      style="left: 500px; top: 100px; height: 500px"
    >
      <div
        slot="body"
        style="width: 100%; padding-top: 0.5em; padding-bottom: 0.5em"
      >
        <test-checkbox
          v-model="row.selected"
          @change="rowSelectedChanged(row)"
        ></test-checkbox>
      </div>
    </theone-window>
  </div>
</template>

<script>
export default {
  name: 'test-checkbox',
  components: {},
  data() {},
  methods: {
    rowSelectedChanged: function (row) {
      if (row.selected) {
        this.$emit('selected', row)
      }
      this.$emit('selectedrowschange', this.selectedRows)
    },
  },
}
</script>

<style lang="scss">
</style>
