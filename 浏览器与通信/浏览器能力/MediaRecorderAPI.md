# 浏览器屏幕录制-MediaRecorder API

> MediaStream Recording API 由一个主接口`MediaRecorder`组成，此接口负责从`MediaStream`获取数据并将其传递给调用者处理。数据通过一系列`dataavaliable`事件传递，可以进一步处理数据，或将其写入文件。

## 一、基本流程

### 1. 权限申请

```js
// 获取用户屏幕录制的权限
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: true
})
```

### 2. 录制视频类型确认

```js
// 确认当前环境所支持的屏幕录制文件类型
const mime = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/webm'
```



### 3. 实例化

```js
// 需要用到步骤1stream流和和步骤2的mimeType
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: mime
})
```



### 4. 事件监听

- `dataavailable` 该事件在停止录制后触发（优先于`onStop`），可用于获取录制的媒体资源 (在事件的 `data` 属性中会提供一个可用的 [`Blob`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBlob) 对象)

- `stop` 用来处理 `stop` 事件, 该事件会在媒体录制结束时、媒体流（[`MediaStream`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMediaStream)）结束，触发`dataavailable`后触发。

```js
const chunks = []

mediaRecorder.addEventListener("dataavaliable", function (e) {
  chunks.push(e.data)
})

mediaRecorder.addEventListener("stop", () => {
  const blob = new Blob(chunks, {
    type: chunks[0].type
  })
  // 获取可用的url
  const url = URL.createObjectURL(blob)
  // .. 
})
```





## 二、实现

```js
export function backTraceNode(el) {
  if (!el?.children?.length) {
    return [el]
  }
  return [el, ...Array.from(el.children).map(backTraceNode)].flat()
}
// 1、从html字符串中提取出bolb文件临时路径
const getVideoListByHtml = (html) => {
  const dom = document.createElement('div')
  dom.innerHTML = html
  return backTraceNode(dom)
    .filter((item) => item.nodeName === 'VIDEO')
    .map((v) => v.src)
}

// 2、根据临时路径，生成相应的File
const getFileFromBlobUrl = async (blobUrlList) => {
  const pList = list.map((url) => {
    return fetch(url)
  })
  const data = await Promise.all(pList)
  const blobList = data.map((v) => v.blob())
  const res = await Promise.all(blobList)
  return res.map(blob=>{
    return new File([blob], 'video.webm', { type: 'video/webm' })
  })
}

// 3、文件上传并替换对应的url
const replaceVideoUrl = (html, hashUrlMapList) => {
  const dom = document.createElement('div')
  dom.innerHTML = html
  const videoList = backTraceNode(dom).filter((item) => item.nodeName === 'VIDEO')
  videoList.forEach((el) => {
    el.src = 'https:' + findUrlByHash(el.src, hashUrlMapList)
  })
  return dom.innerHTML
}
```





## 三、兼容性

![image-20250429144609973](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202504291447964.png)



- 出于安全性考虑，浏览器层面申请权限（`navigator.mediaDevices`），仅支持 `https` 或 `localhost`