<template>
  <div class="list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="titleBox">
      <h2 class="title">{{title}}</h2>
    </div>
    <div class="infoBox" ref="infoBox">
      <div class="infoBox_bd" :style="bgStyle" ref="infoBoxBd">
        <div class="infoBox_main">
          <h3 class="infoBox_main_title">{{title}}
            <span class="day" v-if="day">第{{day}}天</span>
          </h3>
          <p class="updateTime">{{updateTime}}
            <span v-if="updateTime" class="txt">更新</span>
          </p>
        </div>
      </div>
    </div>
    <div class="tabBox" ref="tabBox">
      <ul class="tab">
        <li class="tab-item" :class="{'active': currentShow === 0}" @click="selectTab(0)">歌单</li>
        <li class="tab-item" :class="{'active': currentShow === 1}" @click="selectTab(1)">详情</li>
      </ul>
    </div>
    <div class="contentBox" 
         ref="contentBox"
         @touchstart.prevent="contentBoxTouchStart"
         @touchmove.prevent="contentBoxTouchMove"
         @touchend="contentBoxTouchEnd"
    >
      <scroll class="contentBox_item"
              ref="contentBoxitem0"
              :data="songs"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll_0"
              @scrollEnd="scrollEnd_0"
              >
        <div class="itemContentSongs" ref="itemContent0">
          <all-player v-show="songs.length>0"></all-player>
          <song-list :songs="songs"></song-list>
        </div>
      </scroll>
      <scroll class="contentBox_item"
              ref="contentBoxitem1"
              :data="info"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll_1"
              @scrollEnd="scrollEnd_1"
              >
        <div class="itemContentDesc" ref="itemContent1">
          <p class="infoText" ref="infoText" v-html="info[0]"></p>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import AllPlayer from 'base/all-player/all-player'
import { prefixStyle } from 'common/js/dom'

const titleHeight = 65
const tabHeight = 44

const transform = prefixStyle('transform')
// const filter = prefixStyle('filter')

export default {
  data () {
    return {
      currentShow: 0,
      scrollY_0: 0,
      scrollY_1: 0,
      scrollEndY_0: 0,
      scrollEndY_1: 0,
      translateY: 0,
      initscrollY_0: true,
      initscrollY_1: false
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  props: {
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
      type: Array,
      default: () => []
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    selectTab (key) {
      this.currentShow = key
      let offsetWidth = -this.currentShow * window.innerWidth
      this.$refs.contentBox.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    // X轴滑动切换导航内容
    contentBoxTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    contentBoxTouchMove (e) {
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
      this.$refs.contentBox.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    contentBoxTouchEnd () {
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
      this.$refs.contentBox.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    // y轴滚动结束
    scrollEnd_0 (pos) {
      this.scrollEndY_0 = pos.y
    },
    scrollEnd_1 (pos) {
      this.scrollEndY_1 = pos.y
    },
    // Y轴滚动
    scroll_0 (pos) {
      this.scrollY_0 = pos.y
    },
    scroll_1 (pos) {
      this.scrollY_1 = pos.y
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
    this.touch = {}
  },
  mounted () {
    this.infoBoxHeight = this.$refs.infoBox.offsetHeight
    this.$refs.infoBoxBd.style.paddingTop = `${this.infoBoxHeight}px`
    this.$refs.tabBox.style.top = `${this.infoBoxHeight}px`
    this.$refs.itemContent0.style.paddingTop = `${this.infoBoxHeight + tabHeight}px`
    this.$refs.itemContent1.style.paddingTop = `${this.infoBoxHeight + tabHeight}px`
    this.$refs.infoText.style.minHeight = `${this.$refs.contentBox.clientHeight - titleHeight - tabHeight}px`
    // 最大滚动值(滚动标志位)
    this.minTranslateY = -this.infoBoxHeight + titleHeight
  },
  watch: {
    // scrollY (newY) {
    //   // console.log(newY)
    //   // 最大变化高度
    //   let maxTranslateY = Math.max(this.minTranslateY, newY)
    //   let blur = 0
    //   const percent = Math.abs(maxTranslateY / (this.infoBoxHeight - titleHeight))
    //   // 处理下拉infoBox背景图向下延伸
    //   if (newY >= 0) {
    //     this.$refs.infoBox.style.height = `${this.infoBoxHeight + newY}px`
    //     this.$refs.infoBox.style.zIndex = ''
    //   } else {
    //     this.$refs.infoBox.style.zIndex = 5
    //     // 处理背景模糊
    //     blur = Math.min(2 * percent, 2)
    //   }
    //   if (newY < this.minTranslateY) {
    //     this.titleTop = `${titleHeight}px`
    //   } else {
    //     this.titleTop = `${this.infoBoxHeight + newY}px`
    //   }
    //   this.$refs.infoBoxBg.style[filter] = `blur(${blur}px)`
    // },
    // scrollY_0 (newY, oldY) {
    //   let val = newY - oldY
    //   const arr = [0, 1]
    //   arr.forEach(i => {
    //     if (!this.initscrollY_0) {
    //       return
    //     }
    //     if (newY < 0) {
    //       if (this.currentShow !== i) {
    //         if (this.minTranslateY < newY) {
    //           // 向下滑
    //           if (val > 0) {
    //             if (this[`scrollY_${i}`] < 0) {
    //               this[`scrollY_${i}`] += val
    //             }
    //           } else {
    //             // 向上滑
    //             if (this[`scrollY_${i}`] > this.minTranslateY) {
    //               this[`scrollY_${i}`] += val
    //             }
    //           }
    //           this.$refs[`contentBoxitem${i}`].scrollTo(0, this[`scrollY_${i}`], 0)
    //         }
    //       }
    //     }
    //   })
    // },
    // scrollY_1 (newY, oldY) {
    //   let val = newY - oldY
    //   const arr = [0, 1]
    //   arr.forEach(i => {
    //     if (!this.initscrollY_1) {
    //       return
    //     }
    //     if (this.currentShow !== i) {
    //       if (newY < 0) {
    //         if (this.minTranslateY < newY) {
    //           // 向下滑
    //           if (val > 0) {
    //             if (this[`scrollY_${i}`] <= 0) {
    //               this[`scrollY_${i}`] += val
    //             }
    //           } else {
    //               // 向上滑
    //             if (this[`scrollY_${i}`] >= this.minTranslateY) {
    //               this[`scrollY_${i}`] += val
    //             }
    //           }
    //           this.$refs[`contentBoxitem${i}`].scrollTo(0, this[`scrollY_${i}`], 0)
    //         }
    //       }
    //     }
    //   })
    // },
    scrollEndY_0 (newY, oldY) {
      let deltaY = newY - oldY
      console.log(`${newY}---${oldY}`)
      console.log(deltaY)
      const arr = [0, 1]
      arr.forEach(i => {
        if (!this.initscrollY_0) {
          return
        }
        if (this.currentShow !== i) {
          if (this[`scrollY_${this.currentShow}`] < 0) {
            if (this.minTranslateY < this[`scrollY_${this.currentShow}`]) {
              // 向下滑
              if (deltaY > 0) {
                if (this[`scrollY_${i}`] <= 0) {
                  this[`scrollY_${i}`] += deltaY
                }
              } else {
                // 向上滑
                if (this[`scrollY_${i}`] >= this.minTranslateY) {
                  this[`scrollY_${i}`] += deltaY
                }
              }
              this.$refs[`contentBoxitem${i}`].scrollTo(0, this[`scrollY_${i}`], 0)
            }
          }
        }
      })
    },
    scrollEndY_1 (newY, oldY) {
      let deltaY = newY - oldY
      console.log(deltaY)
      console.log(`${newY}---${oldY}`)
      const arr = [0, 1]
      arr.forEach(i => {
        if (!this.initscrollY_1) {
          return
        }
        if (this.currentShow !== i) {
          if (this[`scrollY_${this.currentShow}`] < 0) {
            if (this.minTranslateY < this[`scrollY_${this.currentShow}`]) {
              // 向下滑
              if (deltaY > 0) {
                if (this[`scrollY_${i}`] <= 0) {
                  this[`scrollY_${i}`] += deltaY
                }
              } else {
                // 向上滑
                if (this[`scrollY_${i}`] >= this.minTranslateY) {
                  this[`scrollY_${i}`] += deltaY
                }
              }
              this.$refs[`contentBoxitem${i}`].scrollTo(0, this[`scrollY_${i}`], 0)
            }
          }
        }
      })
    },
    currentShow (newVal) {
      const arr = [0, 1]
      this[`initscrollY_${newVal}`] = true
      arr.forEach(i => {
        if (newVal !== i) {
          this[`initscrollY_${i}`] = false
        }
      })
    }
  },
  components: {
    Scroll,
    SongList,
    AllPlayer
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
    overflow: hidden;
    background: $color-bg;
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
    .titleBox {
      position: fixed;
      top: 0;
      left: 0;
      height: 65px;
      width: 100%;
      z-index: 40;
      overflow: hidden;
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
        opacity: 0;
      }
    }
    .infoBox {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 38%;
      z-index: -1;
      transform-origin: top;
      overflow: hidden;
      .infoBox_bd {
        position: relative;
        width: 100%;
        height: 0;
        background-position: 0 -60px;
        background-size: cover;
        .infoBox_main {
          position: absolute;
          left: 0;
          bottom: 10px;
          width: 100%;
          color: $color-text-ll;
          .infoBox_main_title {
            width: 100%;
            height: 20px;
            line-height: 20px;
            margin-bottom: 5px;
            text-align: center;
            font-size: $font-size-medium-x;
            .day {
              padding-left: 5px;
            }
          }
          .updateTime {
            width: 100%;
            height: 20px;
            text-align: center;
            line-height: 20px;
            font-size: $font-size-small;
            .txt {
              padding-left: 5px;
            }
          }
        }
      }
      // .infoBox_bg {
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   z-index: 10;
      //   width: 100%;
      //   height: 100%;
      //   object-fit: cover;
      // }
    }
    .tabBox {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 44px;
      background: $color-header-bg;
      z-index: 40;
      .tab {
        display: flex;
        width: 100%;
        height: 44px;
        line-height: 44px;
        font-size: $font-size-medium;
        background: $color-header-bg;
        .tab-item {
          flex: 1;
          padding-bottom: 4px;
          text-align: center;
          color: $color-text-l;
          &.active {
            color: $color-theme;
            border-bottom: 2px solid $color-theme;
          }
        }
      }
    }
    .contentBox {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      white-space: nowrap;
      font-size: 0;
      z-index: 10;
      .contentBox_item {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .itemContentDesc {
          box-sizing: border-box;
          width: 100%;
          .infoText {
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            line-height: 24px;
            white-space: normal;
            font-size: $font-size-medium-x;
            color: $color-text-l;
            background: $color-bg;
          }
        }
      }
    }
  }
</style>