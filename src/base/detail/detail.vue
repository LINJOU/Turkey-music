<template>
  <div class="detail" ref="detail">
    <p class="infoText" v-html="info"></p>
  </div>
</template>
<script>
const titleHeight = 65
const tabHeight = 44

export default {
  props: {
    info: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    this.$refs.detail.style.minHeight = `${this.clientHeight - titleHeight - tabHeight}px`
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .detail {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    background: $color-bg;
    .infoText {
      line-height: 24px;
      white-space: normal;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
</style>

