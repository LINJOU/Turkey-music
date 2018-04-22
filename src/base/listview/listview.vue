<template>
  <!-- @scroll监听滚动 -->
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
      <ul>
          <li class="list-group" v-for="group in data" ref="listGroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
                      <img v-lazy="item.avatar" class="avatar">
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <!-- touchmove.stop.prevent阻止底下一层的滑动 -->
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
          <ul>
              <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
          </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
        <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
      <div v-show="!data.length" class="loading-container">
        <loading></loading>
      </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

// 锚点的高度
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      // 观测实时滚动位置
      scrollY: -1,
      // 高亮索引
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      // 获取开始触摸点的相关信息
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 记录当前锚点
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 计算滚到哪个锚点 或0可以取整
      let dalta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 滚动后的锚点
      let anchorIndex = parseInt(this.touch.anchorIndex) + dalta
      // console.log(anchorIndex)
      this._scrollTo(anchorIndex)
      // console.log(anchorIndex)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      // console.log(this.scrollY)
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算高度
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    // 确保dom完全渲染 渲染到dom需要时间
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部， newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 上限
        let height1 = listHeight[i]
        // 下限
        let height2 = listHeight[i + 1]
        // 如果listHeight[i]为最后一个，或向上滚动（newY为负）大于上限 且 -newY小于下限
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          // console.log(this.currentIndex)
          return
        }
      }
      // 当滚动到底部，，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll, Loading
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  .listview {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: $color-bg;
      .list-group {
          .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-dialog-bg;
            &.active {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              color: $color-theme;
            }
          }
          ul {
           .list-group-item {
              display: flex;
              align-items: center;
              padding: 10px 22px 0 30px;
              .avatar {
                flex: 0 0 50px;
                width: 50px;
                height: 50px;
                padding: 1px;
                border-radius: 50%;
                box-sizing: border-box;
              }
              .name {
                flex: 1;
                height: 50px;
                line-height: 50px;
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
                @include border-1px($color-dialog-bg);
              }
              &:last-child {
                padding-bottom: 6px;  
                .name {
                  padding-bottom: 0;
                  @include border-none();
                }   
              }
            }
          }
      }
      .list-shortcut {
          position: absolute;
          z-index: 30;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          padding: 20px 0;
          border-radius: 10px;
          text-align: center;
          background: $color-bg-d;
          font-family: Helvetica;
          .item {
              padding: 3px;
              line-height: 1;
              color: $color-text-l;
              font-size: $font-size-small;
              &.current {
                  color: $color-theme;
              }
          }
      }
      .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        .fixed-title {
          height: 30px;
          line-height: 30px;
          padding-left: 20px;
          font-size: $font-size-small;
          color: $color-text-l;
          background: $color-dialog-bg;
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
  }
</style>
