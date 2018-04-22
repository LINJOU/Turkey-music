// 获取歌手页数据
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

export function getSingerList () {
  const url = 'http://localhost:3000/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerId) {
  const url = 'http://localhost:3000/api/getSingerDetail'

  const time = Date.parse(new Date())

  const data = Object.assign({}, commonParams, {
    singerid: singerId,
    uin: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 100,
    begin: 0,
    _: time
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取播放地址的key
export function getMusicExpress (songmid, guid) {
  const url = 'http://localhost:3000/api/getMusicExpress'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: guid
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}