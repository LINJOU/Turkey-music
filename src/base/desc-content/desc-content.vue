<template>
  <div class="descContent" @click="close">
    <div class="descMian" @click="stop($event)">
      <h3 class="desctitle">{{desctitle}}</h3>
      <scroll class="descScroll" :probeType="probeType" :bounce="bounce">
        <div class="desctext" v-html="desctext"></div>
      </scroll>
    </div>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'

export default {
  props: {
    desctitle: {
      type: String,
      default: '简介'
    },
    desctext: {
      type: String,
      default: ''
    }
  },
  created () {
    this.probeType = 3
    this.bounce = false
  },
  methods: {
    close () {
      this.$emit('close')
    },
    stop (e) {
      e.cancelBubble = true
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .descContent {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    .descMian {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -50% 0 0 -30%; 
      width: 60%;
      height: 50%;
      border: 2px solid $color-dialog-bg;
      border-radius: 8%;
      background: $color-bg;
      overflow: hidden;
      .desctitle {
        position: relative;
        text-align: center;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: $font-size-large;
        background: $color-header-bg;
        color: $color-text-ll;
        @include border-1px($color-dialog-bg)
      }
      .descScroll {
        width: 100%;
        height: 85%;
        overflow: hidden;
        .desctext {
          width: 100%;
          line-height: 20px;
          padding: 10px;
          box-sizing: border-box;
          font-size: $font-size-medium-x;
          color: $color-text-l;
          word-break: break-all;
        }
      }
    }
  }
</style>

