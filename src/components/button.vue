<template>
  <button class="theone-button"   :class="btnClass">
    <slot>默认按钮</slot>  
  </button>
</template>

<script>
export default {
  //   属性
  props: {
    type: {
      type: String, // 属性类型
      default: '', // 默认值
      validator(type) {
        // 属性传参的校验
        let types = ['warning', 'success', 'danger', 'primary', 'info']
        if (type && !types.includes(type)) {
          console.error('mine-button:type 类型必须为: ' + types.join('、'))
        }
        return true
      },
    },
  },
  computed: {
    btnClass() {
      let classes = [];
      if (this.type) {
        classes.push(`theone-button-${this.type}`);
      }
      // if (this.iconPosition) {
      //   classes.push(`mine-button-${this.iconPosition}`);
      // }
      return classes;
    },
  },
  name: "theone-button"
};
</script>


<style lang="scss" >
@import '../styles/common/index.scss';
$height: 42px;
$font-size: 16px;
$color: #606266;
$border-color: #dcdfe6;
$background: #ecf5ff;
$active-color: #3a8ee6;

.theone-button {
  border-radius: $border-radius;
  border: 1px solid $border-color;
  color: $color;
  background: #fff;
  height: 42px;
  cursor: pointer;
  font-size: $font-size;
  line-height: 1;
  padding: 12px 20px;
  display: inline-flex;
  justify-content: center;
  vertical-align: middle;
  // & 表示引用父元素 就是这里的 .theone-button
  &:hover {
    border-color: $border-color;
    background-color: $background;
  }
  &:focus,
  &:active {
    color: $active-color;
    border-color: $active-color;
    background-color: $background;
    outline: none;
  }
//   相当于 for each
  @each $type,  // $type 就是 primary, $color 就是 $primary 表示的颜色
    $color
      in(
        primary: $primary,
        success: $success,
        warning: $warning,
        danger: $danger,
        info: $info
      )
  {
    // &-#{$type} 表示 .theone-button-primary 
    &-#{$type} {
      background: #{$color};  // 
      border: 1px solid #{$color};
      color: #fff;
      fill: #fff;
    }
  }
//   for each
  @each $type,
    $color
      in(
        primary: $primary-hover,
        success: $success-hover,
        warning: $warning-hover,
        danger: $danger-hover,
        info: $info-hover
      )
  {
    //   hover 时的样式
    &-#{$type}:hover {
      background: #{$color};
      border: 1px solid #{$color};
      color: #fff;
      fill: #fff;
    }
  }

  @each $type,
    $color
      in(
        primary: $primary-active,
        success: $success-active,
        warning: $warning-active,
        danger: $danger-active,
        info: $info-active
      )
  {
    //   active,focus 时的样式
    &-#{$type}:active,
    &-#{$type}:focus {
      background: #{$color};
      border: 1px solid #{$color};
      color: #fff;
      fill: #fff;
    }
  }
  .icon + span {
    margin-right: 5px;
  }
  &-left {
    svg {
      order: 1;
    }
    span {
      order: 2;
    }
  }
  &-right {
    svg {
      order: 2;
    }
    span {
      order: 1;
    }
  }
}
</style>