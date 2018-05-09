<template>
  <ul class="list-tab">
    <li class="list-tab-item" v-for="(item, index) in tabData" :class="{'active': currentIndex === index}" @click="tabItem(index)">
        <span>{{item.name}}</span>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      tabData: {
        type: Array,
        default: () => []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      tabItem (index) {
        this.$emit('tabSelect', index)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .list-tab {
    position: relative;
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: flex;
    background: $color-header-bg;
    .list-tab-item {
      flex: 1;
      padding-bottom: 4px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-l;
      &.active {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }    
    }
  }
</style>