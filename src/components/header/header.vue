<template>
  <div class="header">
      <div class="icon"></div>
      <h1 class="text">Turkey Music</h1>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
    @import '../../common/scss/variable';
    @import '../../common/scss/mixin';
    .header {
        position: relative;
        height: 44px;
        text-align: center;
        color: $color-theme;
        background: $color-header-bg;
        font-size: 0;
        .icon {
            display: inline-block;
            vertical-align: top;
            margin-top: 6px;
            width: 30px;
            height: 32px;
            margin-right: 9px;
            @include bg-image('logo');
            background-size: 30px 32px;
        }
        .text {
            display: inline-block;
            vertical-align: top;
            line-height: 44px;
            font-size: $font-size-large
        }
    }
</style>
