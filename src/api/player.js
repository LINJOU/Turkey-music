// 获取歌曲的vkey
import {commonParams} from './config'
// 引用axios
import axios from 'axios'

// 获取key
export function getSongKey (songmid, guid) {
  const url = 'http://localhost:3000/api/getMusicExpress'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: '205361747',
    uin: 0,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}