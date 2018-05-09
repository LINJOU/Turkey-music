<template>
  <scroll class="listItem" ref="listItem" :probeType="probeType" :listenScroll="listenScroll" :data="data" @scroll="scroll">
    <div class="listItemContent" ref="listItemContent">
      <slot></slot>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'

const titleHeight = 65
const tabHeight = 44

export default {
  data () {
    return {
      scrollY: 0
    }
  },
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
  mounted () {
    this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
    this.$refs.listItem.$el.style.width = `${this.clientWidth}px`
    this.$refs.listItemContent.style.minHeight = `${this.clientHeight - titleHeight - tabHeight}px`
  },
  methods: {
    scroll (pos) {
      this.$emit('scroll', Math.round(pos.y))
    },
    scrollTo (...arg) {
      this.$refs.listItem.scrollTo(...arg)
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
    height: 100%;
    vertical-align: top;
    background: $color-bg;
    .listItemContent {
      width: 100%;
    }
  }
</style>

