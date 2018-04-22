// 获取歌手页数据
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

// 热门搜索
export function getHotkey () {
  const url = 'http://localhost:3000/api/getHotkey'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 搜索
export function search (query, page, zhida, perpage) {
  const url = 'http://localhost:3000/api/search'

  const time = Date.parse(new Date())

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: time
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}