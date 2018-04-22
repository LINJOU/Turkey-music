<template>
  <div class="discList" ref="discList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="titleBox">
      <div class="title" ref="title">
        <h2 class="name name_song" ref="nameSong">歌曲</h2>
        <div class="name name_title" ref="nameTitle">
          <span ref="titleTxt" v-if="onTranslate">{{title}}</span>
          <txt-marquee class="nameTitleBox" :switch="onSwitch" v-else>
            <span class="space"></span>
            <span>{{title}}</span>
          </txt-marquee>
        </div>
      </div>
      <img class="title_bg" :src="bgImage" ref="titleBg">
    </div>
    <div class="allPlayTop" v-show="allPlayTop" v-if="songs.length">
      <all-player @allPlay="_allPlay"></all-player>
    </div>
    <scroll class="disc-wrapper" ref="discWrapper" :data="songs" :probeType="probeType" :listenScroll="listenScroll" :bounce="bounce" @scroll="scroll">
      <div class="disc-content">
        <div class="infoBox" ref="infoBox">
          <div class="infoBox_bd">
            <div class="album" ref="album">
              <div class="album_media">
                <img class="album_cover" :src="bgImage" width="125" height="125">
                <p class="num">{{visitnum}}</p>
              </div>
              <div class="album_bd">
                <h2 class="album_name">{{title}}</h2>
                <div class="author">
                  <img v-lazy="headurl" class="author_avatar">
                  <div class="author_bd">
                    <span class="author_name">{{nickname}}</span>
                  </div>
                </div>
                <p class="album_disc" @click="openDescContent">
                  <span>简介：</span>
                  <span v-html="desc"></span>
                </p>
              </div>
            </div>
          </div>
          <img :src="bgImage" class="infoBox_bg">
        </div>
        <div class="main">
          <div class="count_box">
            <div class="count_box_desc">
              歌单
              <span class="count_box_num">共 {{totalSongNum}} 首</span>
            </div>
            <div class="count_box_favorite">
              <span class="count_box_txt">收藏</span>
              <i class="count_box_icon icon-not-favorite"></i>
            </div>
          </div>
          <div class="count_box_allplay" v-if="songs.length">
            <all-player @allPlay="_allPlay"></all-player>
          </div>
          <div class="count_box_songlist" ref="list">
            <song-list :songs="songs" @select="selectItem"></song-list>
          </div>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-if="!songs.length">
      <loading></loading>
    </div>
    <div class="desc-warpper" ref="descWarpper">
      <desc-content :desctext="desc" @close="closeDescContent"></desc-content>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import AllPlayer from 'base/all-player/all-player'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import DescContent from 'base/desc-content/desc-content'
import TxtMarquee from 'base/txt-marquee/txt-marquee'
import { getSongUrl } from 'common/js/player'
import { playlistMixin } from 'common/js/mixin'

const countBoxHeight = 50

const titleHeight = 65

export default {
  mixins: [playlistMixin],
  data () {
    return {
      percent: 0,
      scrollY: 0,
      percentShow: 0,
      allPlayTop: false,
      onSwitch: false,
      onTranslate: true
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    headurl: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    totalSongNum: {
      type: Number,
      default: 0
    },
    listennum: {
      type: Number,
      default: 0
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    visitnum () {
      let num = this.listennum / 10000
      return num > 0 ? `${num.toFixed(1)} 万` : parseInt(num * 10000)
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
    this.bounce = false
  },
  mounted () {
    this.$refs.infoBox.style.height = `${this.$refs.discList.clientHeight * 0.38}px`
    this.infoBoxHeight = parseFloat(this.$refs.infoBox.offsetHeight)
    // nameTitle的宽度
    this.nameTitleWidth = this.$refs.nameTitle.offsetWidth
    // titleTxt的宽度
    this.titleTxtWidth = this.$refs.titleTxt.offsetWidth
    this.onTranslate = this.nameTitleWidth > this.titleTxtWidth
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.paddingBottom = bottom
      this.$refs.discWrapper.refresh()
    },
    _allPlay () {
      getSongUrl(this.songs[0].mid).then(res => {
        this.allPlay({
          list: this.songs,
          url: res
        })
      })
    },
    selectItem (item, index) {
      getSongUrl(item.mid).then(res => {
        this.selectPlay({
          list: this.songs,
          index,
          url: res
        })
      })
    },
    back () {
      this.$router.go(-1)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    closeDescContent () {
      this.$refs.descWarpper.style.display = 'none'
    },
    openDescContent () {
      this.$refs.descWarpper.style.display = 'block'
    },
    ...mapActions([
      'selectPlay',
      'allPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      // 透明度百分比
      let maxTranslateY = Math.min(Math.abs(newY), this.infoBoxHeight)
      this.percent = 1 - Math.abs(maxTranslateY / this.infoBoxHeight)
      this.$refs.title.style.background = `rgba(0,0,0,${(1 - this.percent) * 0.5})`
      this.$refs.titleBg.style.opacity = `${1 - this.percent}`
      this.$refs.album.style.opacity = `${this.percent}`

      // 标题切换
      let maxShowTranslateY = Math.min(Math.abs(newY), (this.infoBoxHeight - titleHeight))
      this.percentShow = Math.abs(maxShowTranslateY / ((this.infoBoxHeight - titleHeight) / 2))
      if (this.percentShow <= 1) {
        this.$refs.nameSong.style.opacity = `${1 - this.percentShow}`
        this.$refs.nameTitle.style.opacity = 0
        this.onSwitch = false
      } else {
        this.$refs.nameSong.style.opacity = 0
        this.onSwitch = true
        this.$refs.nameTitle.style.opacity = `${this.percentShow - 1}`
      }
      if (newY <= -(this.infoBoxHeight + countBoxHeight - titleHeight)) {
        this.allPlayTop = true
      } else {
        this.allPlayTop = false
      }
    }
  },
  components: {
    AllPlayer,
    SongList,
    Loading,
    Scroll,
    DescContent,
    TxtMarquee
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/mixin.scss";

  .discList {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-bg;
    .back {
      position: absolute;
      top: 20px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .titleBox {
      position: fixed;
      top: 0;
      left: 0;
      height: 65px;
      width: 100%;
      z-index: 40;
      overflow: hidden;
      .title {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 0;
        overflow: hidden;
        background: rgba(0, 0, 0, 0);
        z-index: 40;
        .name {
          position: absolute;
          top: 20px;
          left: 20%;
          width: 60%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          overflow: hidden;
          white-space:nowrap;
          font-size: $font-size-large;
          color: $color-text;
          z-index: 40;
          &.name_song {
            opacity: 1;
          }
          &.name_title {
            opacity: 0;
            .nameTitleBox {
              span {
                font-size: $font-size-large;
                &.space {
                  padding-left: 100%;
                }
              }
            }
          }
        }
      }
      .title_bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65px;
        margin: -5px;
        z-index: 38;
        filter: blur(5px);
        opacity: 0;
        transform: scale(1.4);
      }
    }
    .allPlayTop {
      position: absolute;
      top: 64px;
      left: 0;
      width: 100%;
      overflow: hidden;
      z-index: 40;
    }
    .disc-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 30;
      overflow: hidden;
      .disc-content {
        position: relative;
        width: 100%;
        .infoBox {
          position: relative;
          width: 100%;
          height: 38%;
          overflow: hidden;
          .infoBox_bd {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            padding-top: 80px;
            box-sizing: border-box;
            overflow: hidden;
            background: rgba(0, 0, 0, .5);
            z-index: 20;
            .album {
              width: 100%;
              padding: 0 18px;
              box-sizing: border-box;
              display: flex;
              font-size: 0;
              .album_media {
                position: relative;
                width: 125px;
                height: 125px;
                flex: 0 0 125px;
                .num {
                  position: absolute;
                  top: 105px;
                  left: 10px;
                  font-size: $font-size-medium;
                }
              }
              .album_bd {
                flex: 1;
                margin-left: 10px;
                padding-top: 10px;
                overflow: hidden;
                .album_name {
                  width: 100%;
                  text-align: left;
                  max-height: 44px;
                  line-height: 22px;
                  font-size: $font-size-medium-x;
                }
                .author {
                  margin-top: 8px;
                  display: flex;
                  overflow: hidden;
                  .author_avatar {
                    display: block;
                    width: 24px;
                    height: 24px;
                    flex: 0 0 24px;
                    border-radius: 50%;
                  }
                  .author_bd {
                    flex: 1;
                    margin-left: 12px;
                    .author_name {
                      display: block;
                      width: 100%;
                      line-height: 24px;
                      text-align: left;
                      white-space: nowrap;
                      font-size: $font-size-medium;
                      color: $color-text;
                    }
                  }
                }
                .album_disc {
                  height: 20px;
                  line-height: 20px;
                  text-align: left;
                  margin-top: 10px;
                  font-size: $font-size-medium;
                  @include no-wrap();
                }
              }
            }
          }
         .infoBox_bg {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            transform: scale(1.2);
            filter: blur(20px);
            object-fit: cover;
          }
        }
        .main {
          position: relative;
          width: 100%;
          .count_box {
            position: relative;
            height: 50px;
            line-height: 54px;
            padding: 0 16px;
            background: $color-bg-d;
            font-size: 0;
            .count_box_desc {
              font-size: $font-size-medium;
              color: $color-text-l;
              .count_box_num {
                margin-left: 4px;
              }
            }
            .count_box_favorite {
              position: absolute;
              top: 0;
              right: 16px;
              font-size: $font-size-medium;
              color: $color-theme;
              .count_box_icon {
                vertical-align: middle;
                margin-left: 10px;
                font-size: $font-size-large-x;
              }
            }                           
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      top: 70%;
      width: 100%;
      transform: translateY(-50%);
    }
    .desc-warpper {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100;
    }
  }
</style>

