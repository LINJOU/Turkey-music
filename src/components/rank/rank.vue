<template>
  <div class="rank" ref="rank">
    <scroll class="topListContent" :data="topList" ref="list">
      <div>
        <h3 class="title" v-show="topList.length">TURKEY音乐巅峰榜</h3>
        <ul>
          <li class="item" v-for="item in topList" @click="selectItem(item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl">
              <span class="listenCount">{{normalizeCount(item.listenCount)}}</span>
              <i class="icon-play"></i>
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) in item.songList">
                <span>{{index + 1}}</span>
                <span>
                  <span class="song-name">{{song.songname}}</span> - {{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.list.refresh()
    },
    normalizeCount (count) {
      count = count / 10000
      return count > 0 ? `${parseInt(count).toLocaleString()} 万` : (count.toFixed(4) * 10000).toLocaleString()
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    background: $color-bg-d;
    .topListContent {
      height: 100%;
      overflow: hidden;
      .title {
        padding-top: 6px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:first-child {
          padding-top: 6px;
        }
        // 处理被小播放器遮挡
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          position: relative;
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          .listenCount {
            position: absolute;
            top: 80px;
            left: 5px;
            font-size: $font-size-small;
            color: $color-text-ll;
          }
          .icon-play {
            position: absolute;
            top: 80px;
            right: 8px;
            font-size: $font-size-small;
            color: $color-text-ll;
          }
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-hightlight-bg;
          color: $color-text-d;
          font-size: $font-size-small;
          .song {
            @include no-wrap();
            line-height: 26px;
            .song-name {
              color: $color-text-ll;
            }
          }
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>

