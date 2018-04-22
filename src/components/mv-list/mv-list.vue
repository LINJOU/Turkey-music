<template>
  <div class="mv-list-wrapper">
    <div class="mv-list">
      <ul>
        <li class="item" v-for="item in mvList">
          <a :href="item.playUrl" class="content">
            <img v-lazy="item.pic" class="pic" width="100" height="55">
            <span class="right">
              <span class="mv-title" v-html="item.title"></span>
              <span class="mv-date" v-html="item.date"></span>
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!mvList.length">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getMvList } from 'api/mvlist'
import { createMvList } from 'common/js/mvlist'

export default {
  data () {
    return {
      mvList: [],
      begin: 0
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created () {
    this._getMvList()
  },
  methods: {
    _getMvList () {
      this.begin = 0
      getMvList(this.singer.mid, this.begin).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          this.mvList = this._normalizeMvList(res.data.list)
          // console.log(this.mvList)
        }
      })
    },
    _normalizeMvList (list) {
      let ret = []
      list.forEach(item => {
        ret.push(createMvList(item))
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
  .mv-list-wrapper {
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 10px 16px;
    .mv-list {
      .item {
        padding-bottom: 4px;
        .content {
          display: flex;
          .pic {
            flex: 0 0 100px;
            margin-right: 10px;
            vertical-align: bottom;
          }
          .right {
            flex: 1;
            display: flex;
            padding: 10px 0 6px;
            box-sizing: border-box;
            vertical-align: bottom;
            flex-direction: column;
            overflow: hidden;
            @include border-1px($color-text-l);
            .mv-title {
              line-height: 20px;
              @include no-wrap();
              font-size: $font-size-medium-x;
              color: $color-text-l;
            }
            .mv-date {
              margin-top: 6px;
              font-size: $font-size-small;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .loading-container {
      margin-top: 45%;
    }
  }
</style>