<template>
  <div class="apper-timeline">
    <div class="apper-timeline-item block">
      <div class="apper-timeline-item-content">
        <div class="apper-timeline-item-content-title">
          <h3>CSS Timeline Animation</h3>
        </div>
        <div class="apper-timeline-item-content-description">
          <p>借助 animation-timeline 属性，可以实现时间轴动画。</p>
          <p>实现滚动操作与动画效果的深度绑定，同时支持时间轴的分段控制，如 <code>scroll()</code> 和 <code>view()</code> 函数。</p>
          <p>场景案例：长页面视差效果、元素渐进式显隐交互和阅读进度指示器等。</p>
          <p>价值优势：替代传统的 JavaScript 监听逻辑，优化页面性能和精简代码。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.apper-timeline-item-content-title h3 {
  font-size: 16px;
}

.apper-timeline-item-content-description p {
  font-size: 14px;
}

@keyframes apper {
  from {
    opacity: 0;
    scale: 0.8;
  }

  to {
    opacity: 1;
    scale: 1;
  }
}

.block {
  animation: apper linear;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}
</style>