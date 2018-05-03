<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref="query" v-model="query" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>
<script>
import { debounce } from 'common/js/util'
export default {
  data () {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    },
    // 焦点处理(移开焦点)
    blur () {
      this.$refs.query.blur()
    }
  },
  created () {
    // 将query暴露给外面组件
    // 与watch () 一样
    // 需要进行节流
    this.$watch('query', debounce(newQuery => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>
<style lang="scss"> 
  @import "../../common/scss/variable.scss";

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-hightlight-bg;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-dialog-bg;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-hightlight-bg;
      color: $color-text;
      outline: none;
      font-size: $font-size-medium;
      &::placeholder {
        color: $color-text-d
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-theme;
    }
  }
</style>
