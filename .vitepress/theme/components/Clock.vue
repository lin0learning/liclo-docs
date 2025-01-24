<template>
  <div class="clock-bg">
    <canvas id="clock" width="300" height="300">当前浏览器不支持canvas，请升级浏览器</canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  init()
})

function init() {
  const canvasEl: HTMLCanvasElement | null = document.querySelector("#clock")
  if (!canvasEl)
    return
  const ctx = canvasEl.getContext('2d')

  window.requestAnimationFrame(draw)
  function draw() {
    if (!ctx)
      return
    ctx.clearRect(0, 0, 300, 300)
    ctx.save()

    let time = new Date()
    let hour = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    let mill = time.getMilliseconds()

    // 1. 背景
    ctx.save()
    ctx.translate(150, 150)
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(0, 0, 130, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 2. 数字
    let list = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
    ctx.save()
    ctx.translate(150, 150)

    ctx.font = "30px fangsong"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < list.length; i++) {
      let x = 100 * Math.cos(Math.PI * 2 / 12 * i)
      let y = 100 * Math.sin(Math.PI * 2 / 12 * i)
      ctx.fillText(`${list[i]}`, x, y)
    }
    ctx.restore()


    // 3. 时针
    ctx.save()
    ctx.translate(150, 150)
    ctx.rotate(
      Math.PI * 2 / 12 * (hour > 12 ? hour - 12 : hour) +
      Math.PI * 2 / 360 * 30 * minutes / 60
    )
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.lineTo(0, -50)
    ctx.stroke()
    ctx.restore()

    // 4. 分针
    ctx.save()
    ctx.translate(150, 150)
    ctx.rotate(
      Math.PI * 2 / 60 * minutes +
      Math.PI * 2 / 60 / 60 * seconds
    )
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, 20)
    ctx.lineTo(0, -70)
    ctx.stroke()
    ctx.restore()

    // 5. 秒针
    ctx.save()
    ctx.translate(150, 150)
    ctx.rotate(
      Math.PI * 2 / 60 * seconds +
      Math.PI * 2 / 60 / 1000 * mill
    )
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, 25)
    ctx.lineTo(0, -75)
    ctx.stroke()
    ctx.restore()

    // 6. 圆心
    ctx.save()
    ctx.translate(150, 150)
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 7.1 时针刻度
    ctx.save()
    ctx.translate(150, 150)
    // 方法一：计算坐标点
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      let deg = Math.PI * 2 / 12 * i
      ctx.lineWidth = 3
      ctx.moveTo(130 * Math.sin(deg), 130 * Math.cos(deg))
      ctx.lineTo(120 * Math.sin(deg), 120 * Math.cos(deg))
      ctx.stroke()
    }
    ctx.restore()

    // 7.2 分针刻度
    ctx.save()
    ctx.translate(150, 150)
    for (let i = 1; i <= 60; i++) {
      if (i % 5 === 0) continue
      ctx.beginPath()
      let deg = Math.PI * 2 / 60 * i
      ctx.lineWidth = 1
      ctx.moveTo(130 * Math.sin(deg), 130 * Math.cos(deg))
      ctx.lineTo(125 * Math.sin(deg), 125 * Math.cos(deg))
      ctx.stroke()
    }
    ctx.restore()

    ctx.restore()
    requestAnimationFrame(draw)
  }
}
</script>

<style scoped>
.clock-bg {
  width: 300px;
  height: 300px;
  border-radius: 50px;
  margin: 10px;
  background-color: #000;
}
</style>