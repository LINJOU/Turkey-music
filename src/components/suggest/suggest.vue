<template>
  <scroll class="suggest" 
          :data="result"
          :pullUpLoad="pullUpLoad"
          @pullingUp="searchMore" >
    <div class="suggest-list">
      <div class="suggest-item" v-for="item in result">
        <div class="singer" v-if="item.type === 'singer'">
          <div class="icon">
            <i class="icon-mine"></i>
          </div>
          <img v-lazy="item.avatar" width="45">
          <div class="name">
            <p class="text" v-html="item.singername"></p>
            <p class="total">
              <span>歌曲：{{item.songnum}}</span>
              <span>专辑：{{item.albumnum}}</span>
            </p>
          </div>
        </div>
        <div class="song" v-else>
          <div class="icon">
            <i class="icon-music"></i>
          </div>
          <div class="name">
            <p class="text" v-html="item.name"></p>
            <p class="singerName" v-html="item.singer"></p>
          </div>
        </div>
      </div>
      <div class="floor-wrapper">
        <div class="hasMore" v-if="result.length && pullUpFinished">{{pullUpTxt}}</div>
        <loading title="正在加载..." v-if="!pullUpFinished" class="hasMoreLoading"></loading>
      </div>
    </div>
    <div class="loading-wrapper" v-show="!result.length">
      <loading title="正在加载..."></loading>
    </div>
  </scroll>
</template>
<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    // 是否显示歌曲
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 第几页
      page: 1,
      result: [],
      pullUpLoad: {
        threshold: -60
      },
      pullUpFinished: true,
      hasMore: true,
      totalpage: 0
    }
  },
  computed: {
    pullUpTxt () {
      return this.hasMore === true ? '上拉加载更多...' : '没有更多内容了...'
    }
  },
  methods: {
    _search () {
      if (this.query === '') {
        return
      }
      this.page = 1
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          let song = res.data.song
          this.totalpage = Math.ceil(song.totalnum / song.curnum)
          this.result = this._genResult(res.data)
          console.log(this.result)
          if (this.totalpage > 1) {
            this.hasMore = true
          } else {
            this.hasMore = false
          }
        }
      })
    },
    searchMore () {
      this.page++
      if (this.pullUpFinished && (this.page <= this.totalpage)) {
        this.pullUpFinished = false
        setTimeout(() => {
          search(this.query, this.page, this.showSinger, perpage).then(res => {
            if (res.code === ERR_OK) {
              console.log(res.data)
              if (res.data.song) {
                this.result = this.result.concat(this._normalizeSongs(res.data.song.list))
              }
            }
          })
          this.pullUpFinished = true
        }, 500)
        if ((this.page + 1) > this.totalpage) {
          this.hasMore = false
        } else {
          this.hasMore = true
        }
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        let image = `https://y.gtimg.cn/music/photo_new/T001R68x68M000${
          data.zhida.singermid
        }.jpg?max_age=2592000`
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER, avatar: image } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    query () {
      this._search()
    }
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      color: $color-text-d;
      @include border-1px($color-text-l);
      &:last-child {
        @include border-none();
      }
      .singer {
        display: flex;
        align-items: center;
        padding: 4px 0 8px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          .icon-mine {
            font-size: 20px;
            color: $color-text-d;
          }
        }
        img {
          margin-right: 8px;
          border-radius: 50%;
        }
        .name {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          .text {
            line-height: 20px;
            font-size: $font-size-medium-x;
            @include no-wrap();
          }
          .total {
            line-height: 18px;
            @include no-wrap();
            span {
              margin-right: 4px;
              font-size: $font-size-small;
            }
          }
        }
      }
      .song {
        display: flex;
        align-items: center;
        padding: 5px 0;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          .icon-music {
            font-size: 22px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          color: $color-text-d;
          overflow: hidden;
          .text {
            line-height: 20px;
            font-size: $font-size-medium-x;
            @include no-wrap();
          }
          .singerName {
            line-height: 18px;
            font-size: $font-size-small;
            @include no-wrap();
          }
        }
      }
    }
    .floor-wrapper {
      .hasMore {
        height: 46px;
        line-height: 46px;
        text-align: center;
        color: $color-text-l;
      }
      .hasMoreLoading {
        margin: 8px 0;
      }
    }
  }
  .loading-wrapper {
    margin: 5px auto;
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

