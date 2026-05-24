# Web Speech API

在JavaScript中，可以使用Web Speech API 来进行文本到语音（TTS）的播报。以下是一个简单的示例，展示如何使用Web Speech API 来播报字符串文本：

## 1. 检查浏览器是否支持

首先，检查浏览器是否支持Web Speech API：

```javascript
if ('speechSynthesis' in window) {
  console.log('Web Speech API 支持')
} else {
  console.log('Web Speech API 不支持')
}
```

## 2. 创建SpeechSynthesisUtterance对象

使用`SpeechSynthesisUtterance`对象来设置要播报的文本和其他属性（如语言、音调、音量等）。

```javascript
const utterance = new SpeechSynthesisUtterance('你好，这是一个测试文本。')
```

## 3. 设置语音属性（可选）

设置语音的属性，如语言、音调、音量等：

```javascript
utterance.lang = 'zh-CN' // 设置语言为中文
utterance.pitch = 1 // 设置音调 (0到2之间)
utterance.rate = 1 // 设置语速 (0.1到10之间)
utterance.volume = 1 // 设置音量 (0到1之间)
```

## 4. 选择语言（可选）

可以选择特定的语音（如果有多个语音可用）：

```javascript
const voices = window.speechSynthesis.getVoices()
utterance.voice = voices.find(voice => voice.lang === 'zh-CN')  // 选择中文语音
```

## 5. 播报文本

使用`speechSynthesis.speak()`方法来播报文本：

```javascript
window.speechSynthesis.speak(utteracne)
```

## 6. 完整实例

以下是一个完整的实例：

```javascript
if ('speechSynthesis' in window) {
  const utterance = new SpeechSynthesisUtterance('你好，这是一个测试文本。')
  utterance.lang = 'zh-CN'
  utterance.pitch = 1
  utterance.rate = 1
  utterance.volume = 1

  const voices = window.speechSynthesis.getVoices()
  utterance.voice = voices.find(voice => voice.lang === 'zh-CN')

  window.speechSynthesis.speak(utterance)
} else {
  console.log('您的浏览器不支持Web Speech API')
}
```

## 7. 处理语音加载问题

有时语音可能尚未加载完毕，你可以监听`voiceschanged`事件来确保语音加载完成后再进行播报：

```javascript
window.speechSynthesis.onvoiceschanged = function() {
  const voices = window.speechSynthesis.getVoices()
  utterance.voice = voices.find(voice => voice.lang === 'zh-CN')
  window.speechSynthesis.speak(utterance)
}
```

注意事项

- Web Speech API的兼容性可能因浏览器而异，建议在支持的浏览器中使用。
- 某些浏览器可能需要用户交互（如点击页面）才能开始播报。

模拟点击事件（功能可能无效）：

```javascript
const simulateMouseClick = () => {
  // 创建一个点击事件
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true, // 冒泡
    cancelable: true
  })
  const element = document.getElementById('au')
  // 触发点击事件
  element.dispatchEvent(event)
}

onMounted(() => {
  document.getElementById("au").onclick = () => {}
  simulateMouseClick()
})
```

