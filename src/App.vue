<template>
  <div id="app">
    <!-- 顶部 -->
    <v-header></v-header>
    <!-- 标题导航 -->
    <tab></tab>
    <!-- 主体 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <player></player>
  </div>
</template>

<script>
import VHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { setCookie } from 'common/js/cookie'

export default {
  name: 'app',
  created () {
    // 向cookie储存pgv_pvid
    this._setPvid()
  },
  methods: {
    getGuid () {
      let d = new Date()
      let t = d.getUTCMilliseconds()
      return Math.round(2147483647 * Math.random()) * t % 1e10
    },
    _setPvid () {
      let guid = this.getGuid()

      setCookie('pgv_pvid', guid, 1)
    }
  },
  components: {
    VHeader,
    Tab,
    Player
  }
}
</script>

<style lang="scss">
@import 'common/scss/index'
</style>
