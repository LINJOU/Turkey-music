export default class Singer {
  constructor ({id, mid, name}) {
    this.id = id
    this.mid = mid
    this.name = name
    this.avatar = `http://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
  }
}
export function createSinger (singer) {
  return new Singer({
    id: singer.singer_id,
    mid: singer.singer_mid,
    name: singer.singer_name
  })
}