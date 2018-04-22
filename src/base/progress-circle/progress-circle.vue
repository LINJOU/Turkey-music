<template>
  <div class="progress-circle">
      <!-- viewBox: 视口 -->
      <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <!-- cx,cy:定义圆中心的x和y坐标 -->
        <!-- stroke: 定义边框颜色 -->
        <!-- stroke-width: 定义边框的宽度 -->
        <!-- fill: 设置形状内的填充颜色 -->
        <!-- stroke-dasharray: 用于创建虚线 -->
        <!-- stroke-dashoffser: 虚线偏移量 : 实线虚线绘制的起点距路径开始的距离 -->
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
        <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashoffset"></circle>
      </svg>
      <slot></slot>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // 周长
        dashArray: Math.PI * 100
      }
    },
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dashoffset () {
        //  实线虚线绘制的起点距路径开始的距离
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>
<style lang="scss">
  @import "../../common/scss/variable.scss";

  .progress-circle {
    position: relative;
    circle {
      transform-origin: center;
      &.progress-background {
        stroke-width: 4;  
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        stroke-width: 10;
        stroke-linecap: round;
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>
