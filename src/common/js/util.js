// 工具函数

// 打乱算法
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 防抖函数(一定时间内，规定事件被触发一次)
export function debounce (fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 节流函数（一定时间内，规定事件被触发的次数）
export function throttle (fn, delay) {
  let init = true
  return function (...args) {
    if (!init) {
      return
    }
    init = false
    setTimeout(() => {
      fn.apply(this, args)
      init = true
    }, delay)
  }
}