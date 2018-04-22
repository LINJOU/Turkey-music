<template>
  <div class="tab">
    <router-link class="tab-item lf" to="/user">
      <i class="tab-link icon-mine"></i>
    </router-link>
    <router-link class="tab-item" to="/recommend">推荐</router-link>
    <router-link class="tab-item" to="/singer">歌手</router-link>
    <router-link class="tab-item" to="/rank">排行</router-link>
    <router-link class="tab-item rt" to="/search">
      <i class="tab-link icon-search"></i>
    </router-link>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
  @import '../../common/scss/variable';
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;
    .tab-item {
      flex: 1;
      padding-bottom: 4px;
      text-align: center;
      &.lf{
        text-align: left;
        .icon-mine {
          justify-content: flex-start;
          line-height: 44px;
          padding: 12px;
          font-size: 20px;
        }
        &.active {
          border-bottom: 2px solid transparent          
        }
      }
      &.rt{
        text-align: right;
        .icon-search {
          justify-content: flex-end;
          line-height: 44px;
          padding: 9px 10px;
          font-size: 24px;
        }
        &.active {
          border-bottom: 2px solid transparent          
        }
      }
    }
    & > .active {
      color: $color-theme;
      border-bottom: 2px solid $color-theme
    }
  }
</style>


