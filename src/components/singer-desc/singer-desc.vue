<template>
  <div class="singer-desc">
    <div class="desc-wrapper">
      <p class="text" v-html="desc[0].SingerDesc"></p>
    </div>
    <div class="loading-container" v-show="!desc[0].SingerDesc">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'

export default {
  data () {
    return {
      desc: [
        {SingerDesc: ''}
      ],
      scrollY: 0
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created () {
    this._getDesc()
  },
  methods: {
    _getDesc () {
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          let data = res.data
          this.desc[0].SingerDesc = data.SingerDesc
        }
      })
    }
  },
  components: {
    Loading
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .singer-desc {
    .desc-wrapper {
      position: relative;
      top: 0;
      left: 0;
      bottom: 0;
      padding: 10px 16px;
      .text {
        line-height: 20px;
        text-align: justify;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
    }
    .loading-container {
      margin-top: 40%;
    }
  }
</style>

