<template>
  <!-- 轮播图组件 -->
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="item in list" class="swiper-slide">
        <a :href="item.linkUrl">
          <img :src="item.picUrl">
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
// 引入swiper
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  name: 'slider',
  props: ['list'],
  mounted () {
    /* eslint-disable no-new */
    new Swiper('.swiper-container', {
      direction: 'horizontal',
      speed: 200,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      // 阻止轮播图滑动就会直接跳链接
      touchMoveStopPropagation: false,
      pagination: {
        el: '.swiper-pagination',
        bulletActiveClass: 'active'
      }
    })
  }
}
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";
  .swiper-container {
    width: 100%;
    .swiper-wrapper {
      .swiper-slide {
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          img {
            display: block;
            width: 100%;
          }
        }
      }
    }
    .swiper-pagination {
      bottom: 12px;
      .swiper-pagination-bullet {
        margin: 0 4px;
        width: 8px;
        height: 8px;
        background: $color-text;
        opacity: .6;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text;
          opacity: .6;
        }
      }
    }
  }
</style>
