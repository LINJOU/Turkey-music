import { getCookie } from 'common/js/cookie'
import { getSongKey } from 'api/player'
import { ERR_OK } from 'api/config'

// 获取歌曲url
export function getSongUrl (songmid) {
  return new Promise((resolve, reject) => {
    _getSongkey(songmid).then(data => {
      const songUrl = 'http://dl.stream.qqmusic.qq.com/'
      const url = `${songUrl}${data.filename}?fromtag=38&vkey=${data.vkey}&guid=${data.guid}`
      resolve(url)
    })
  })
}

// 获取vkey
function _getSongkey (songmid) {
  return new Promise((resolve, reject) => {
    let guid = _getPvid()
    getSongKey(songmid, guid).then(res => {
      if (res.code === ERR_OK) {
        let item = res.data.items[0]
        let vkey = item.vkey
        let filename = item.filename
        resolve({vkey, filename, guid})
      }
    })
  })
}

// 获取cookie
function _getPvid () {
  return getCookie('pgv_pvid')
}
