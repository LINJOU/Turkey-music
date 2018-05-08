<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <!-- @click.stop阻止冒泡 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">
              <span>{{modeText}}</span>
              <span class="num">( {{sequenceList.length}} )</span>
            </span>
            <span class="add" @click="addSong">
              <i class="icon-add"></i>
            </span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :refreshDelay="refreshDelay" :data="sequenceList" :bounce="bounce">
          <div>
            <transition-group tag="ul" name="list" ref="list">
              <!-- :key : 区分每个li -->
              <li ref="listItem" class="item" :key="item.id" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text" v-html="item.name"></span>
                <span class="like" @click.stop="toggleFavorite(item)">
                  <i :class="getFavoriteIcon(item)"></i>
                </span>
                <span class="delete" @click.stop="deleteOne(item)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
            <div class="addSong" @click="addSong">
              <span class="add">
                <i class="icon-add"></i>
              </span>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import AddSong from '@/components/add-song/add-song'
  import { mapActions } from 'vuex'
  import { playMode } from 'common/js/config'
  import { playerMixin } from 'common/js/mixin'

  export default {
    mixins: [playerMixin],
    data () {
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    created () {
      this.bounce = false
    },
    computed: {
      modeText () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
      show () {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide () {
        this.showFlag = false
      },
      getCurrentIcon (item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem (item, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex(song => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrollToCurrent (current) {
        const index = this.sequenceList.findIndex(song => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
      deleteOne (item) {
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      confirmClear () {
        this.deleteSongList()
        this.hide()
      },
      addSong () {
        this.$refs.addSong.show()
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-bg-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0)
      }
    }
    .list-wrapper  {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      .list-header {
        position: relative;
        padding: 14px 24px;
        background-color: $color-hightlight-bg;
        font-size: 0;
        @include border-1px($color-text-l);
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 26px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
            .num {
              padding: 2px;
            }
          }
          .add {
            @include extend-click();
            margin-right: 30px;
            .icon-add {
              border: 1px solid $color-text-d;
              border-radius: 20%;
              padding: 2px;
              font-size: $font-size-small;
              color: $color-text-d;
            }
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium-x;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        background-color: $color-hightlight-bg;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 24px;
          box-sizing: border-box;
          overflow: hidden;
          @include border-1px($color-text-d);
          &.list-enter-active, &.list-leave-active {
            transition: all .1s
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .like {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;           
          }
        }
        .addSong {
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text-l;
          .add {
            padding-right: 5px;
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 60px;
        background: rgba(0, 0, 0, .6);
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>

