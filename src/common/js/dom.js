// dom操作

// 添加className
export function addClass (el, className) {
  // 判断是否已存在该className
  if (hasClass(el, className)) {
    return
  }
  // 才开原有的className
  let newClass = el.className.split(' ')
  // 添加新的className
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断是否已存在className
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// 获取属性值
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 封装浏览特性检测 内核前缀

// 用于判断浏览器供应商
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Mosz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      // 确认供应商
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 获取translate
export function getTranslateVal (translate) {
  let reg = /-?[0-9]+\.?[0-9]*/g
  return translate.match(reg)
}