// 获取Mv数据
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

export function getMvList (singermid, begin) {
  const url = 'http://localhost:3000/api/getMvList'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid,
    order: 'listen',
    begin,
    num: 30,
    cid: 205360581
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}