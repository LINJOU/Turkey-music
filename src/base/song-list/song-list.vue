<template>
  <div class="song-list-wrapper">
    <div class="song-list">
      <ul>
        <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">
          <div class="content">
            <h2 class="name" :class="{active: song.id === currentSong.id && activeShow}" v-html="song.name"></h2>
            <p class="desc" v-html="getDesc(song)"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    props: {
      songs: {
        type: Array,
        default: () => []
      },
      activeShow: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters([
        'currentSong'
      ])
    },
    methods: {
      selectItem (item, index) {
        this.$emit('select', item, index)
      },
      getDesc (song) {
        return `${song.singer} · ${song.album}`
      }
    }
  }
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .song-list-wrapper {
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 2px 16px;
    background: $color-bg;
    .song-list {
      ul{
        .item{
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 50px;
          font-size: $font-size-medium;
          @include border-1px($color-dialog-bg);
          .content {
            flex: 1;
            line-height: 18px;
            overflow: hidden;
            .name {
              @include no-wrap();
              color: $color-text-l;
              &.active {
                color: $color-theme;
              }
            }
            .desc {
              @include no-wrap();
              margin-top: 2px;
              color: $color-text-d;
              font-size: $font-size-small;
            }
          }
          &:last-child {
            @include border-none();
          }
        }
      }
    }
  }
</style>

