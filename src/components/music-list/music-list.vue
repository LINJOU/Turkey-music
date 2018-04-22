<template>
  <div class="list-wrapper">
    <div class="play" v-show="songs.length>0">
      <all-player @allPlay="_allPlay"></all-player>
    </div>
    <song-list :songs="songs" @select="selectItem" ref="list"></song-list>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SongList from 'base/song-list/song-list'
import AllPlayer from 'base/all-player/all-player'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'
import { getSongList } from 'api/songs'
import { getSongUrl } from 'common/js/player'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      begin: 0,
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created () {
    this._getSongList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      // this.$refs.list.refresh()
    },
    _allPlay () {
      getSongUrl(this.songs[0].mid).then(res => {
        this.allPlay({
          list: this.songs,
          url: res
        })
      })
    },
    _getSongList () {
      this.begin = 0
      getSongList(this.singer.mid, this.begin).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        // 解构赋值list.musicData
        let { musicData } = item
        // console.log(musicData)
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    selectItem (item, index) {
      getSongUrl(item.mid).then(res => {
        this.selectPlay({
          list: this.songs,
          index,
          url: res
        })
      })
    },
    ...mapActions([
      'selectPlay',
      'allPlay'
    ])
  },
  components: {
    SongList,
    AllPlayer
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .musicList {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-bg;
    .play {
      height: 46px;
      width: 100%;
      padding: 0 16px;
      line-height: 46px;
      box-sizing: border-box;
      @include border-1px($color-dialog-bg);
      .icon-play {
        margin-right: 10px;
        font-size: $font-size-large;
        color: $color-sub-theme;
      }
      .text {
        font-size: $font-size-medium-x;
        color: $color-dialog-bg;
      }
    }
  }

</style>

