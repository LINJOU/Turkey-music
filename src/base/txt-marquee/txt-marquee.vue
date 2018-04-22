<template>
  <div class="txtMarquee" ref="txtMarquee">
    <span class="txtMarqueeBox" ref="txtMarqueeBox">
      <slot></slot>
    </span>
  </div>
</template>
<script>
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')

export default {
  props: {
    // 开关
    switch: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init () {
      this.destroy()
      // 清除克隆的子元素
      if (this.cloneNode) {
        this.$refs.box.removeChild(this.cloneNode)
      }
      this.cloneNode = null
      // 获取box节点下的第一个元素
      let firstItem = this.$refs.txtMarqueeBox.firstElementChild

      if (!firstItem) {
        // 如果没有li元素则退出
        return false
      }

      // 获得ul下li节点的长度
      this.len = this.$refs.txtMarqueeBox.children.length
      this.width = firstItem.offsetWidth
      if (this.len > 1) {
        // 复制第一个元素到最后一个
        this.cloneNode = firstItem.cloneNode(true)
        this.$refs.txtMarqueeBox.appendChild(this.cloneNode)
        // 复制最后一个元素到第一个
        let lastItem = this.$refs.txtMarqueeBox.children[this.len - 1]
        this.cloneNode = lastItem.cloneNode(true)
        this.$refs.txtMarqueeBox.insertBefore(this.cloneNode, firstItem)
      } else {
        // 复制第一个元素到最后一个
        this.cloneNode = firstItem.cloneNode(true)
        this.$refs.txtMarqueeBox.appendChild(this.cloneNode)
      }
    },
    start () {
      let firstItem = this.$refs.txtMarqueeBox.firstElementChild
      if (!firstItem) {
        return false
      }
      let firstItemWidth = firstItem.offsetWidth
      let translateX = firstItemWidth
      let x = 0
      this.timer = setInterval(() => {
        if (x > -translateX) {
          x--
        } else {
          x = translateX
        }
        this.$refs.txtMarqueeBox.style[transform] = `translateX(${x}px)`
      }, 20)
    },
    destroy () {
      this.timer && clearInterval(this.timer)
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.destroy()
  },
  watch: {
    switch (newVal) {
      this.destroy()
      if (!newVal) {
        return false
      } else {
        this.start()
      }
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .txtMarquee {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
    font-size: 0;
    .txtMarqueeBox {
      display: inline-block;
      text-align: center;
      height: 100%;  
    }
  }
</style>

