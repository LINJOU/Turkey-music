// 处理cookie

// 设置cookie
export function setCookie (cname, cvalue, exdays) {
  let d = new Date()
  d.setDate(d.getDate() + exdays)
  document.cookie = cname + '=' + cvalue + ((exdays === null) ? '' : ';expires=' + d.toGMTString())
}

// 获取cookie
export function getCookie (cname) {
  let arr = document.cookie.split('; ')
  for (let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i].split('=')
    if (item[0] === cname) {
      return item[1]
    }
  }
  return ''
}

// 清除cookie
export function clearCookie (cname) {
  let d = new Date()
  d.setTime(d.getTime() - 1)
  let cvalue = getCookie(name)
  if (cvalue !== null) {
    document.cookie = cname + '=' + cvalue + ';expires=' + d.toGMTString()
  }
}