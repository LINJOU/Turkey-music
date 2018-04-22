// 排行榜
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

export function getTopList () {
  const url = 'http://localhost:3000/api/SongTopList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: getDate()
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
// 排行榜歌单详情
export function getMusicList (topid) {
  const url = 'http://localhost:3000/api/getMusicList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: getDate()
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

function getDate () {
  return Date.parse(new Date())
}