<template>
  <div class="detail">
    <p class="infoText" v-html="info"></p>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .detail {
    width: 100%;
    min-height: 100%;
    padding: 16px;
    box-sizing: border-box;
    .infoText {
      line-height: 24px;
      white-space: normal;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
</style>

