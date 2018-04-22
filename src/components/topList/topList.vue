<template>
  <transition name="move">
    <div class="topList">
      <list :title="title"
            :bgImage="bgImage"
            :listenCount="listenCount"
            :songs="songs"
            :day="day"
            :updateTime="updateTime"
            :info="info"></list>
    </div>
  </transition>
</template>
<script>
import List from 'base/list/list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      songs: [],
      day: '',
      updateTime: '',
      info: []
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      return this.topList.picUrl
    },
    listenCount () {
      return this.topList.listenCount
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      // 处理直接进入toplist
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.day = res.day_of_year
          this.updateTime = res.update_time
          this.songs = this._normalizeSongs(res.songlist)
          this.info[0] = res.topinfo.info
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    List
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .topList {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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