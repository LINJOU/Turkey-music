// 获取推荐页相关的方法
// import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

export function getRecommend () {
  const url = 'http://localhost:3000/api/getRecommend'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList () {
  const url = 'http://localhost:3000/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'ypp',
    hostUin: 0,
    needNewCode: 0,
    rnd: Math.random(),
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = 'http://localhost:3000/api/getSongList'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    onlysong: 0,
    disstid,
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