<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- recommends.length确保slot里面dom渲染完成 addClass获取到el -->
        <slider v-if="recommends.length" :list="recommends"></slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" @click="selectItem(item)">
              <div class="icon">
                <!-- img的load事件判断加载是否完成 -->
                <!-- 图片懒加载 -->
                <!-- 允许点击 -->
                <img class="needsclick" @load="loadImage" v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
// 引用轮播图插件
import slider from 'base/slider/slider'
// 引用srcoll
import scroll from 'base/scroll/scroll'
// 引用loading
import loading from 'base/loading/loading'
// 引用recommend.js
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    // 获取数据
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    // 获取轮播图数据
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    // 获取推荐歌单
    _getDiscList () {
      getDiscList().then(res => {
        this.discList = res.data.list
      })
    },
    // 监听图片是否加载
    loadImage () {
      // 判断一张图片即可
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true // 技巧（设置一个标志位）
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    slider, scroll, loading
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    background: $color-bg;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .recommend-list {
        .list-title {
          margin-bottom: 10px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
          @include border-1px($color-theme);
        }
        ul {
          .item {
            display: flex;
            box-sizing: border-box;
            align-items: center;
            padding: 0 20px 20px 20px;
            .icon {
              flex: 0 0 60px;
              width: 60px;
              padding-right: 20px;
            }
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
              line-height: 20px;
              overflow: hidden;
              font-size: $font-size-medium;
              .name {
                margin-bottom: 10px;
                color: $color-text-l;
              }
              .desc {
                color: $color-text-d
              }
            }
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)
    }
  }
</style>

