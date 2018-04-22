<template>
  <div class="album-list-wrapper">
    <div class="album-list">
      <ul>
        <li class="item" v-for="item in album">
          <div class="icon">
            <img v-lazy="item.albumpic" width="54" height="54">
          </div>
          <div class="text">
            <h2 class="name">{{item.albumName}}</h2>
            <p class="pubtime">{{item.pubTime}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!album.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getAlbum } from 'api/album'
import { createAlbum } from 'common/js/album'

export default {
  data () {
    return {
      album: [],
      begin: 0
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created () {
    this._getAlbum()
  },
  methods: {
    _getAlbum () {
      this.begin = 0
      getAlbum(this.singer.mid, this.begin).then(res => {
        if (res.code === ERR_OK) {
          this.album = this._normalizeAlbum(res.data.list)
          console.log(this.album)
        }
      })
    },
    _normalizeAlbum (list) {
      let ret = []
      list.forEach(item => {
        ret.push(createAlbum(item))
      })
      return ret
    }
  },
  components: {
    Loading
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .album-list-wrapper {
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 10px 16px;
    .album-list {
      .item {
        display: flex;
        padding-bottom: 4px;
        .icon {
          flex: 0 0 54px;
          margin-right: 10px;
          img {
            vertical-align: bottom;
          }
        }
        .text {
          flex: 1;
          display: flex;
          padding: 8px 0 4px;
          box-sizing: border-box;
          vertical-align: bottom;
          flex-direction: column;
          overflow: hidden;
          @include border-1px($color-text-l);
          .name {
            line-height: 18px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .pubtime {
            margin-top: 6px;
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    .loading-container {
      margin-top: 45%;
    }
  }
</style>