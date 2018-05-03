<template>
  <transition name="list-fade">
    <div class="playlist">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content">
          <transition-group tag="ul" name="list">
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like">
                <i></i>
              </span>
              <span class="delete">
                <i></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {}
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
      background-color: $color-hightlight-bg;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
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
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-theme-d;
          }
          .like {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;           
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto 30px;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 60px;
        background: $color-bg-d;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>

