<template>
  <scroll class="listItem" ref="listItem" :probeType="probeType" :listenScroll="listenScroll" :data="data">
    <div class="listItemContent">
      <slot></slot>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    enable () {
      this.$refs.listItem && this.$refs.listItem.enable()
    },
    disable () {
      this.$refs.listItem && this.$refs.listItem.disable()
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .listItem {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: $color-bg;
    overflow: hidden;
  }
</style>

