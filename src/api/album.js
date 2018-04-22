// 获取专辑数据
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

export function getAlbum (singermid, begin) {
  const url = 'http://localhost:3000/api/getAlbum'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid,
    order: 'time',
    begin,
    num: 30,
    exstatus: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}