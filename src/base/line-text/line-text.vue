<template>
  <div class="line-title">
    <div class="line"></div>
    <div class="text"><span v-show="fans !== undefined">{{fans}}</span></div>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    fans: {
      type: String,
      default: '  '
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .line-title {
    display: flex;
    width: 60%;
    height: 12px;
    margin: 0 auto;
    .line {
      flex: 1;
      position: relative;
      top: -6px;
      border-bottom: 1px solid $color-text-l;
    }
    .text {
      padding: 0 4px;
      font-size: $font-size-small-s;
      color: $color-text-l;
    }
  }
</style>

