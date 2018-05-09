<template>
  <div class="list" ref="list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="title" ref="title">{{title}}</h2>
    <div class="topView" ref="topView">
      <div class="shade"></div>
      <img :src="bgImage" class="topViewBg" ref="topViewBg">
      <div class="infoView" ref="infoView">
        <slot name="info"></slot>
      </div>
    </div>
    <div class="tabView" ref="tabView">
      <list-tab :tabData="tabData" :currentIndex="currentIndex" @tabSelect="tabSelect"></list-tab>
    </div>
    <div class="contentView" ref="contentView">
      <div class="moveView" ref="moveView"
           @touchstart.prevent="touchStart"
           @touchmove.prevent="touchMove"
           @touchend="touchEnd">
        <list-item ref="songsItem" :data="songs" @scroll="scroll">
          <all-player v-if="songs.length>0"></all-player>
          <song-list :songs="songs"></song-list>
        </list-item>
        <list-item @scroll="scroll" ref="infoItem">
          <detail :info="info"></detail>
        </list-item>
      </div>   
    </div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import ListItem from 'base/list-item/list-item'
  import SongList from 'base/song-list/song-list'
  import AllPlayer from 'base/all-player/all-player'
  import Detail from 'base/detail/detail'
  import ListTab from 'base/list-tab/list-tab'
  import { prefixStyle } from 'common/js/dom'

  const titleHeight = 65
  const tabHeight = 44
  const infoViewBottom = 30

  const transform = prefixStyle('transform')
  const filter = prefixStyle('filter')

  export default {
    data () {
      return {
        currentIndex: 0,
        scrollY: [
          {songsScrollY: 0},
          {infoScrollY: 0}
        ],
        scrollName: ['songsScrollY', 'infoScrollY'],
        listItemName: ['songsItem', 'infoItem'],
        scrollinit: [
          {songsScrollY: true},
          {infoScrollY: false}
        ],
        tabTop: 0
      }
    },
    props: {
      tabData: {
        type: Array,
        default: () => []
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
      info: {
        type: String,
        default: ''
      }
    },
    computed: {
      songsScrollY () {
        return this.scrollY[0].songsScrollY
      },
      infoScrollY () {
        return this.scrollY[1].infoScrollY
      }
    },
    methods: {
      tabSelect (index) {
        this.currentIndex = index
        let offsetWidth = -this.currentIndex * window.innerWidth
        this.$refs.moveView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      scroll (newY) {
        this.scrollY[this.currentIndex][this.scrollName[this.currentIndex]] = newY
      },
      // 子页面滚动关联
      scrollChange (newY, oldY) {
        let deltaY = newY - oldY
        // 处理滚动回弹未完成切换页面问题
        if (newY > 0) {
          this.moveViewTouch.initiated = false
        } else {
          this.moveViewTouch.initiated = true
        }
        this.scrollY.forEach((item, index) => {
          if (index !== this.currentIndex) {
            if (newY >= this.maxTranslateY && newY <= 0) {
              if (deltaY < 0) {
                if (this.scrollY[index][this.scrollName[index]] < this.maxTranslateY) {
                  this.scrollY[index][this.scrollName[index]] += deltaY
                } else {
                  this.scrollY[index][this.scrollName[index]] = Math.min(0, Math.max(this.maxTranslateY, newY))
                }
              } else {
                if (this.scrollY[index][this.scrollName[index]] <= newY && this.scrollY[index][this.scrollName[index]] < 0) {
                  if (this.scrollY[index][this.scrollName[index]] >= this.maxTranslateY) {
                    this.scrollY[index][this.scrollName[index]] = Math.min(0, Math.max(this.maxTranslateY, newY))
                  } else {
                    this.scrollY[index][this.scrollName[index]] += deltaY
                  }
                }
                if (this.scrollY[index][this.scrollName[index]] === 0) {
                  this.scrollY[index][this.scrollName[index]] = 0
                }
              }
            } else {
              if (newY > 0) {
                if (this.scrollY[index][this.scrollName[index]] < 0) {
                  this.scrollY[index][this.scrollName[index]] += deltaY
                } else {
                  this.scrollY[index][this.scrollName[index]] = newY
                }
              }
              if (newY < this.maxTranslateY) {
                if (this.scrollY[index][this.scrollName[index]] > this.maxTranslateY) {
                  this.scrollY[index][this.scrollName[index]] = Math.min(0, Math.max(this.maxTranslateY, this.scrollY[index][this.scrollName[index]] += deltaY))
                }
              }
            }
            this.$refs[this.listItemName[index]].scrollTo(0, this.scrollY[index][this.scrollName[index]])
            // 处理tabView的top
            let arr = this.scrollY.map((item, index) => {
              return item[this.scrollName[index]]
            })
            let maxY = Math.max(this.maxTranslateY, Math.max.apply(null, arr))
            this.$refs.topView.style.height = `${maxY + this.topViewHeight}px`
            this.topViewBgChange(maxY, this.maxTranslateY)
            this.$refs.tabView.style.top = `${maxY + this.topViewHeight}px`
            this.titleShow(maxY)
          }
        })
      },
      // topview 模糊, 背景图片
      topViewBgChange (newY, maxTranslateY) {
        let maxY = Math.max(maxTranslateY, newY)
        let blur = 0
        let topViewBgHeight = this.topViewHeight
        let infoViewTop = this.infoViewTop
        const percent = Math.abs(maxY / maxTranslateY)
        if (newY < 0) {
          blur = Math.min(5 * percent, 5)
        } else {
          infoViewTop += newY
          topViewBgHeight += newY
        }
        this.$refs.topViewBg.style.height = `${topViewBgHeight}px`
        this.$refs.infoView.style.top = `${infoViewTop}px`
        this.$refs.topViewBg.style[filter] = `blur(${blur}px)`
      },
      // title显示
      titleShow (newY) {
        if (newY > 0) {
          return
        }
        const translateY = -this.topViewHeight + titleHeight + infoViewBottom + this.infoViewHeight
        const infoBottom = infoViewBottom + this.infoViewHeight
        let percent = 0
        if (newY <= -(infoBottom)) {
          percent = (newY + infoBottom) / translateY
        }
        this.$refs.title.style.opacity = percent
      },
      back () {
        this.$router.back()
      },
      // X轴滑动切换导航内容
      touchStart (e) {
        this.moveViewTouch.initiated = true
        const moveViewTouch = e.touches[0]
        this.moveViewTouch.startX = moveViewTouch.pageX
        this.moveViewTouch.startY = moveViewTouch.pageY
      },
      touchMove (e) {
        if (!this.moveViewTouch.initiated) {
          return
        }
        const moveViewTouch = e.touches[0]
        const deltaX = moveViewTouch.pageX - this.moveViewTouch.startX
        const deltaY = moveViewTouch.pageY - this.moveViewTouch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        const left = this.currentIndex * -window.innerWidth
        let offsetWidth
        if (this.currentIndex === 0) {
          offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX))
        } else if (this.currentIndex === 1) {
          offsetWidth = Math.min(0, Math.max(-(this.currentIndex * window.innerWidth), left + deltaX))
        } else {
          offsetWidth = left + deltaX
        }
        this.moveViewTouch.percent = deltaX / window.innerWidth
        this.$refs.moveView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      touchEnd () {
        let offsetWidth
        if (this.moveViewTouch.percent < 0) {
          // 从右向左滑
          if (this.currentIndex === 1) {
            this.currentIndex = 1
          } else {
            if (this.moveViewTouch.percent < -0.5) {
              this.currentIndex++
            }
          }
        } else {
          // 从左向右滑
          if (this.currentIndex === 0) {
            this.currentIndex = 0
          } else {
            if (this.moveViewTouch.percent > 0.5) {
              this.currentIndex--
            }
          }
        }
        offsetWidth = -this.currentIndex * window.innerWidth
        this.$refs.moveView.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    created () {
      this.moveViewTouch = {}
    },
    mounted () {
      this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
      this.topViewHeight = this.clientWidth
      this.$refs.topView.style.height = `${this.topViewHeight}px`
      this.$refs.tabView.style.top = `${this.topViewHeight}px`
      this.$refs.contentView.style.top = `${this.topViewHeight + tabHeight}px`
      this.$refs.moveView.style.width = `${this.$refs.contentView.clientWidth * this.tabData.length}px`
      this.maxTranslateY = -this.topViewHeight + titleHeight
    },
    updated () {
      this.$nextTick(() => {
        this.infoViewHeight = this.$refs.infoView.offsetHeight
        this.infoViewTop = this.topViewHeight - this.infoViewHeight - infoViewBottom
        this.$refs.infoView.style.top = `${this.infoViewTop}px`
      })
    },
    watch: {
      currentIndex (newIndex) {
        this.scrollinit.forEach((item, index) => {
          if (index === newIndex) {
            this.scrollinit[index][this.scrollName[index]] = true
          } else {
            this.scrollinit[index][this.scrollName[index]] = false
          }
        })
      },
      songsScrollY (newY, oldY) {
        if (!this.scrollinit[0].songsScrollY) {
          return
        }
        this.scrollChange(newY, oldY)
      },
      infoScrollY (newY, oldY) {
        if (!this.scrollinit[1].infoScrollY) {
          return
        }
        this.scrollChange(newY, oldY)
      }
    },
    components: {
      Scroll,
      ListItem,
      SongList,
      AllPlayer,
      Detail,
      ListTab
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
      z-index: 350;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
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
      z-index: 350;
      opacity: 0;
    }
    .topView {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: rgb(7, 17, 27);
      overflow: hidden;
      z-index: 50;
      .shade {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .2);
      }
      .topViewBg {
        position: absolute;
        width: 100%;
        z-index: -1;
      }
      .infoView {
        position: relative;
        left: 0;
        width: 100%;
        text-align: center;
      }
    }
    .tabView {
      width: 100%;
      position: absolute;
      left: 0;
      z-index: 200;
    }
    .contentView {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      font-size: 0;
      z-index: 10;
      .moveView {
        height: 100%;
      }
    }
  }
</style>