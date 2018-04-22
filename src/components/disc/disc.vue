<template>
  <transition name="move">
    <div class="disc">
      <disc-list :title="title"
                 :desc="desc"
                 :bgImage="bgImage"
                 :headurl="headurl"
                 :nickname="nickname"
                 :totalSongNum="totalSongNum"
                 :listennum="listennum"
                 :songs="songs"
      ></disc-list>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import DiscList from 'base/disc-list/disc-list'
import { createSong } from 'common/js/song'

export default {
  data () {
    return {
      desc: '',
      headurl: '',
      nickname: '',
      totalSongNum: 0,
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    listennum () {
      return this.disc.listennum
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    // 处理直接进入disc
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then(res => {
        if (ERR_OK === res.code) {
          let cd = res.cdlist[0]
          this.desc = cd.desc
          this.headurl = cd.headurl
          this.nickname = cd.nickname
          this.totalSongNum = cd.total_song_num
          this.songs = this._normalizeSongs(cd.songlist)
        }
      })
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
    DiscList
  }
}
</script>
<style lang="scss">
  .disc {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .move-enter-active,
  .move-leave-active {
    transition: all 0.3s;
  }
  .move-enter,
  .move-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
