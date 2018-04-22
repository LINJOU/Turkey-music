// 获取歌曲页数据
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

// 获取歌曲列表
export function getSongList (singermid, begin) {
  const url = 'http://localhost:3000/api/getSingerSongList'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid,
    order: 'listen',
    begin,
    num: 30,
    songstatus: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取歌词
export function getLyric (mid) {
  const url = 'http://localhost:3000/api/lyric'

  const time = Date.parse(new Date())

  const data = Object.assign({}, commonParams, {
    pcachetime: time,
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: '667008142'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}