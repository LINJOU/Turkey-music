<template>
  <transition name="move">
    <div class="topList">
      <list :title="title"
            :bgImage="bgImage"
            :listenCount="listenCount"
            :songs="songs"
            :tabData="tabData"
            :info="topinfo.info">
        <div slot="info" class="infoCentent">
          <div v-if="topinfo.UpdateType === '1'">
            <p class="time">
              <span class="txt">{{topinfo.ListName}}</span>
              <span class="day">第{{data.day_of_year}}天</span>
            </p>
            <p class="updateTime">
              <span>{{data.update_time}}</span> 更新
            </p>
          </div>
          <div v-if="topinfo.UpdateType === '0'">
            <p class="time">
              <span class="week">第{{getWeek(this.data.date)}}周</span>
            </p>
            <p class="updateTime">
              <span>{{data.update_time}}</span> 更新
            </p>
          </div>
        </div>
      </list>
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
      data: {},
      tabData: [
        {name: '歌曲'},
        {name: '详情'}
      ],
      topinfo: {}
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
          this.data = res
          this.topinfo = res.topinfo
          this.songs = this._normalizeSongs(res.songlist)
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
    },
    getWeek (date) {
      let arr = date.split('_')
      return arr[1]
    }
  },
  components: {
    List
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .topList {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .infoCentent {
      font-size: 0;
      color: $color-text;
      .time {
        font-size: $font-size-medium-x;
        margin-bottom: 8px;
        .txt {
          padding-right: 5px;
        }
        .week {
          padding: 2px 10px;
          line-height: 24px;
          height: 16px;
          border: 1px solid $color-text;
          border-radius: 8px;
        }
      }
      .updateTime {
        font-size: $font-size-small;
      }
    }
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