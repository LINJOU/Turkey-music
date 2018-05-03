<template>
  <!-- 滚动组件 -->
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      // 滚动类型
      probeType: {
        type: Number,
        default: 1
      },
      // 点击事件
      click: {
        type: Boolean,
        default: true
      },
      // 动态数据
      data: {
        type: Array,
        default: null
      },
      // 是否监听滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      bounce: {
        type: Boolean,
        default: true
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      // 确保dom完全渲染
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      // 初始化
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullUpLoad: this.pullUpLoad,
          bounce: this.bounce
        })

        if (this.listenScroll) {
          let me = this
          // pos位置
          this.scroll.on('scroll', pos => {
            // 派发scroll事件
            me.$emit('scroll', pos)
          })
          this.scroll.on('scrollEnd', pos => {
            // 派发scrollEnd事件
            me.$emit('scrollEnd', pos)
          })
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      // 代理方法
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      _initPullUpLoad () {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    // 监听data变化
    watch: {
      data () {
        setTimeout(() => {
          if (this.pullUpLoad) {
            this.scroll.finishPullUp()
            this.refresh()
          } else {
            this.refresh()
          }
        }, this.refreshDelay)
      }
    }
  }
</script>
<style lang="scss">
</style>

