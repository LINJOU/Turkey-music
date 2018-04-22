<template>
  <div class="all-player" @click="sequence">
    <i class="icon-play"></i>
    <span class="text">全部播放</span>
  </div>
</template>
<script>
export default {
  methods: {
    sequence () {
      this.$emit('allPlay')
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .all-player {
    width: 100%;
    height: 46px;
    line-height: 46px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: $font-size-medium-x;
    background: $color-bg;
    @include border-1px($color-dialog-bg);
    .icon-play {
      padding: 6px;
      margin-right: 6px;
      color: $color-theme;
      font-size: $font-size-large-x;
    }
    .text {
      padding-top: 2px;
      color: $color-text-l;
      font-size: $font-size-medium-x;
    }
  }
</style>
