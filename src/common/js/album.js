import { createSinger } from 'common/js/singer'

export default class Album {
  constructor ({albumID, albumMID, albumName, albumpic, albumtype, company, desc, lan, latestSong, pubTime, singerID, singerMID, singerName, singerpic, singers, singersName}) {
    this.albumID = albumID
    this.albumMID = albumMID
    this.albumName = albumName
    this.albumpic = albumpic
    this.albumtype = albumtype
    this.company = company
    this.desc = desc
    this.lan = lan
    this.latestSong = latestSong
    this.pubTime = pubTime
    this.singerID = singerID
    this.singerMID = singerMID
    this.singerName = singerName
    this.singerpic = singerpic
    this.singers = singers
  }
}

export function createAlbum (singerAlbum) {
  return new Album({
    albumID: singerAlbum.albumID,
    albumMID: singerAlbum.albumMID,
    albumName: singerAlbum.albumName,
    albumpic: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${singerAlbum.albumMID}.jpg?max_age=2592000`,
    albumtype: singerAlbum.albumtype,
    company: singerAlbum.company,
    desc: singerAlbum.desc,
    lan: singerAlbum.lan,
    latestSong: singerAlbum.latest_song,
    pubTime: singerAlbum.pubTime,
    singerID: singerAlbum.singerID,
    singerMID: singerAlbum.singerMID,
    singerName: singerAlbum.singerName,
    singerpic: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${singerAlbum.singerMID}.jpg?max_age=2592000`,
    singers: singers(singerAlbum.singers),
    singersName: filterSinger(singerAlbum.singers)
  })
}

// 处理一首歌多个歌手
function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.singer_name)
  })
  return ret.join(' / ')
}

function singers (singers) {
  let ret = []
  singers.forEach(singer => {
    ret.push(createSinger(singer))
  })
  return ret
}