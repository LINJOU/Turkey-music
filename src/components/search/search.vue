<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box'
import { getHotkey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from '@/components/suggest/suggest'

export default {
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  created () {
    this._getHotkey()
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    _getHotkey () {
      getHotkey().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.hotkey)
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  components: {
    SearchBox, Suggest
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $color-hightlight-bg;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 170px;
      bottom: 0;
      padding-top: 4px; 
    }
  }
</style>

