<template>
  <div class="description"></div>
</template>

<script setup>

</script>

<style scoped>
.description {
  --loading-grey: #61da87;
  width: 300px;
  height: 150px;
  background-color: var(--loading-grey);
  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    var(--loading-grey);
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1.5s loading ease-in-out infinite;
  border-radius: 5px;
  margin: 10px 0;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
</style>