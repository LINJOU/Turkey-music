<template>
  <transition name="slide">
    <div class="singer-detail" ref="singerDetail">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h2 class="title" v-show="titleTop">{{title}}</h2>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
        <div class="content" ref="content">
          <h1 class="name">{{title}}</h1>
          <div class="lineText">
            <line-text :fans="fans"></line-text>
          </div>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <div class="tab-wrapper" ref="tabWrapper">
        <singer-tab :data="total"></singer-tab>
      </div>
      <scroll class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
        <div class="singer-content" ref="singerContent">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import LineText from 'base/line-text/line-text'
import SingerTab from 'base/singer-tab/singer-tab'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
const filter = prefixStyle('filter')

const RESERVED_HEIGHT = 40

export default {
  data () {
    return {
      titleTop: false,
      total: {},
      fans: '',
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    },
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  created () {
    this._getDetail()
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _getDetail () {
      // 处理直接进入子路由
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          let data = res.data
          this.fans =
            data.fans / 10000 > 0
              ? (data.fans / 10000).toFixed(1) + '万粉丝'
              : data.fans + '粉丝'
          let albumTotal = data.albumTotal + ''
          let mvTotal = data.mvTotal + ''
          let total = data.total + ''
          this.total = Object.assign({}, {
            albumTotal,
            mvTotal,
            total
          })
        }
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  mounted () {
    // 获取content位置
    this.contentTop = parseInt(window.getComputedStyle(this.$refs.content, null).top)
    // 获取bgimage高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.imageWidth = this.$refs.bgImage.clientWidth
    // 最小滚动值
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight + RESERVED_HEIGHT}px`
    this.$refs.tabWrapper.style.top = `${this.imageHeight}px`
    // 设置最小高度
    this.$refs.singerContent.style.minHeight = `${this.$refs.singerDetail.clientHeight - RESERVED_HEIGHT * 2}px`
  },
  watch: {
    scrollY (newY) {
      // 最大滚动距离
      let maxTranslateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      // 缩放
      let scale = 1
      // 滤镜
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0, ${maxTranslateY}px, 0)`
      // 滚动距离与图片缩放比例 abs绝对值
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(2 * percent, 2)
      }
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.tabWrapper.style.top = '40px'
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT + 5}px`
        this.$refs.bgImage.style.width = `${this.imageWidth + 5}px`
        this.$refs.bgImage.style.margin = '-2px'
        this.$refs.content.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.tabWrapper.style.top = `${this.imageHeight + newY}px`
        this.$refs.bgImage.style.width = `${this.imageWidth}px`
        this.$refs.bgImage.style.margin = 0
        this.$refs.content.style.display = ''
      }
      this.$refs.bgImage.style[filter] = `blur(${blur}px)`
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      if (-newY > this.contentTop) {
        this.titleTop = true
      } else {
        this.titleTop = false
      }
    }
  },
  components: {
    LineText,
    Scroll,
    SingerTab
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable.scss";
@import "../../common/scss/mixin.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.move-enter-active,
.move-leave-active {
  transition: all 0.3s;
}
.move-enter,
.move-leave-to {
  transform: translate3d(100%, 0, 0);
}
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-bg;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    opacity: 1;
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .content {
      position: absolute;
      bottom: 30px;
      left: 0;
      z-index: 50;
      width: 100%;
      height: 100px;
      text-align: center;
      .name {
        width: 100%;
        line-height: 40px;
        text-align: center;
        font-size: $font-size-large-x;
        color: $color-text-ll;
      }
      .lineText {
        width: 100%;
        margin-bottom: 10px;
        text-align: center
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, .2)
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-bg;
  }
  .tab-wrapper {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    z-index: 100;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>

