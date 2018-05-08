<template>
  <transition name="slide">
    <div class="user-center">
      <div  class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">
        <div class="switch-wrapper">
          <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        </div>
      </div>
      <div class="play-btn" v-if="allPlayShow">
        <all-player @allPlay="_allPlay"></all-player>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" ref="favoriteList" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong" :activeShow="activeShow"></song-list>
          </div>
        </scroll> 
        <scroll class="list-scroll" ref="playlist" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong" :activeShow="activeShow"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import Switches from 'base/switches/switches'
  import AllPlayer from 'base/all-player/all-player'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import NoResult from 'base/no-result/no-result'
  import Song from 'common/js/song'
  import { getSongUrl } from 'common/js/player'
  import { mapGetters, mapActions } from 'vuex'
  import { playlistMixin } from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ],
        currentIndex: 0,
        activeShow: false
      }
    },
    computed: {
      allPlayShow () {
        if (this.currentIndex === 0) {
          return this.favoriteList.length
        } else {
          return this.playHistory.length
        }
      },
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noResultDesc () {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '最近没有播放歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '40px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      back () {
        this.$router.back()
      },
      switchItem (index) {
        this.currentIndex = index
      },
      selectSong (song) {
        this.insertSong(new Song(song))
      },
      _allPlay () {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        list = list.map(song => {
          return new Song(song)
        })
        getSongUrl(list[0].mid).then(res => {
          this.allPlay({
            list,
            url: res
          })
        })
      },
      ...mapActions([
        'insertSong',
        'allPlay'
      ])
    },
    components: {
      Switches,
      AllPlayer,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  
  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-bg;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(-100%, 0, 0)
    }
    .back {
      position: absolute;
      top: 20px;
      left: 6px;
      z-index: 300;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      width: 100%;
      height: 80px;
      box-sizing: border-box;
      border-bottom: 1px solid $color-text-l;
      .switch-wrapper {
        padding-top: 26px;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 126px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>

