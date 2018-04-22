<template>
  <div class="music-tab" :data="data">
    <router-link class="tab-item" to="/singer/:id/musicList">歌曲<span class="num" v-show="data.total">{{data.total}}</span></router-link>
    <router-link class="tab-item" to="/singer/:id/album">专辑<span class="num" v-show="data.albumTotal">{{data.albumTotal}}</span></router-link>
    <router-link class="tab-item" to="/singer/:id/mvList">MV<span class="num" v-show="data.mvTotal">{{data.mvTotal}}</span></router-link>
    <router-link class="tab-item" to="/singer/:id/desc">详情</router-link>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .music-tab {
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: $font-size-medium;
    background: $color-header-bg;
    .tab-item {
      flex: 1;
      padding-bottom: 4px;
      text-align: center;
      color: $color-text-ll;
      .num {
        margin-left: 4px;
        font-size: $font-size-small;
      }
      &.active {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
</style>
