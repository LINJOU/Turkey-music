<template>
  <div class="list" ref="list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="topView" ref="topView" :style="bgSrc">
      <h2 class="title">{{title}}</h2>
    </div>
    <scroll class="contentView" ref="contentView" :probeType="probeType" :listenScroll="listenScroll" @scroll="contentScroll">
      <div class="content">
        <ul class="tabView">
          <li v-for="(item, index) in tabdata" class="tabItem" :class="{'active': currentShow === index}" @click="selectTab(index)">{{item}}</li>
        </ul>
        <div class="scrollView" 
             ref="scrollView"
             @touchstart.prevent="touchStart"
             @touchmove.prevent="touchMove"
             @touchend="touchEnd"
        >
          <list-item ref="listItem1" :data="songs">
            <all-player></all-player>
            <song-list :songs="songs"></song-list>
          </list-item>
          <list-item ref="listItem2">
            <detail :info="info"></detail>
          </list-item>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import ListItem from 'base/list-item/list-item'
  import SongList from 'base/song-list/song-list'
  import AllPlayer from 'base/all-player/all-player'
  import Detail from 'base/detail/detail'
  import { prefixStyle } from 'common/js/dom'

  const titleHeight = 65
  const tabHeight = 44
  const allPlayerrHeight = 46
  const songsHeight = 50

  const transform = prefixStyle('transform')

  export default {
    data () {
      return {
        init: true,
        currentShow: 0,
        contentScrollY: 0
      }
    },
    props: {
      tabdata: {
        type: Array,
        default: () => ['歌曲', '详情']
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      listenCount: {
        type: Number,
        default: 0
      },
      songs: {
        type: Array,
        default: () => []
      },
      day: {
        type: String,
        default: ''
      },
      updateTime: {
        type: String,
        default: ''
      },
      info: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgSrc () {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      },
      selectTab (key) {
        this.currentShow = key
        let offsetWidth = -this.currentShow * window.innerWidth
        this.$refs.scrollView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      contentScroll (pos) {
        this.contentScrollY = pos.y
      },
      // X轴滑动切换导航内容
      touchStart (e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      touchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        const left = this.currentShow * -window.innerWidth
        let offsetWidth
        if (this.currentShow === 0) {
          offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX))
        } else if (this.currentShow === 1) {
          offsetWidth = Math.min(0, Math.max(-(this.currentShow * window.innerWidth), left + deltaX))
        } else {
          offsetWidth = left + deltaX
        }
        this.touch.percent = deltaX / window.innerWidth
        this.$refs.scrollView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      touchEnd () {
        let offsetWidth
        if (this.touch.percent < 0) {
          // 从右向左滑
          if (this.currentShow === 1) {
            this.currentShow = 1
          } else {
            if (this.touch.percent < -0.5) {
              this.currentShow++
            }
          }
        } else {
          // 从左向右滑
          if (this.currentShow === 0) {
            this.currentShow = 0
          } else {
            if (this.touch.percent > 0.5) {
              this.currentShow--
            }
          }
        }
        offsetWidth = -this.currentShow * window.innerWidth
        this.$refs.scrollView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
    },
    mounted () {
      this.topViewHeight = this.$refs.topView.offsetHeight
      this.contentViewHeigh = this.$refs.list.offsetHeight - this.topViewHeight - tabHeight - allPlayerrHeight
      this.$refs.contentView.$el.style.top = `${this.topViewHeight}px`
      this.$refs.scrollView.style.height = `${this.$refs.list.clientHeight - titleHeight - tabHeight}px`
      // 最大滚动值
      this.minTranslateY = -this.topViewHeight + titleHeight
    },
    watch: {
      songs (newSongs) {
        if (!this.init) {
          return
        }
        if (this.contentViewHeigh > (newSongs.lenght * songsHeight)) {
          this.$refs.contentView.disable()
        } else {
          this.$refs.listItem1.disable()
          this.$refs.listItem2.disable()
        }
        this.init = true
      },
      contentScrollY (newY) {
        if (newY <= this.minTranslateY) {
          // 先修正
          this.$refs.contentView.scrollTo(0, this.minTranslateY, 0)
          this.$refs.contentView.disable()
          this.$refs.listItem1.enable()
          this.$refs.listItem2.enable()
        }
      }
    },
    components: {
      Scroll,
      ListItem,
      SongList,
      AllPlayer,
      Detail
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .list {
    position: relative;
    width: 100%;
    height: 100%;
    background: $color-bg;
    overflow: hidden;
    .back {
      position: absolute;
      top: 20px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .topView {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding-top: 80%;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: cover;
      .title {
        position: absolute;
        top: 20px;
        left: 10%;
        width: 80%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
        white-space:nowrap;
        overflow: hidden;
        z-index: 30;
      }
    }
    .contentView {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      .content {
        width: 100%;
        .tabView {
          width: 100%;
          height: 44px;
          line-height: 44px;
          display: flex;
          background: $color-header-bg;
          z-index: 30;
          .tabItem {
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
        .scrollView {
          width: 100%;
          font-size: 0;
          white-space: nowrap;
          background: $color-bg;
        }
      }
    }
  }
</style>