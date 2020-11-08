<template>
  <div :class="{ 'wo-input-checkbox': true, checked: checked }">
    <input :id="id" type="checkbox" :checked="checked" @click="handleChanged" />
  </div>
</template>
<script>
export default {
  name: 'theone-checkbox',
  data: function () {
    return {
      value: this.checked ? 'on' : 'off',
    }
  },
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    id: String,
    checked: Boolean,
  },
  methods: {
    // 点击复选框触发的事件
    handleChanged: function (e) {
      var target = e.currentTarget
      // 点击复选框之后，复选框的 checked 属性会发生变化
      // 如果是选中状态
      if (target.checked) {
        target.parentNode.setAttribute('class', 'wo-input-checkbox checked')
      } else {
        // 如果是未选中状态
        target.parentNode.setAttribute('class', 'wo-input-checkbox')
      }
      // value 标志是否开启复选框模式
      this.value = this.checked ? 'on' : 'off'
      e.currentTarget.value = this.value
      this.$emit('change', e.currentTarget.checked)
    },
  },
}
</script>
<style lang="scss">
@import "~@/styles/common/index.scss";
@import "~@/styles/checkbox.scss";

</style>