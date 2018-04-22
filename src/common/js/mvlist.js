export default class Mvlist {
  constructor ({vid, id, title, pic, listenCount, date, playUrl}) {
    this.vid = vid
    this.id = id
    this.title = title
    this.pic = pic
    this.listenCount = listenCount
    this.date = date
    this.playUrl = playUrl
  }
}

export function createMvList (mvlistDate) {
  return new Mvlist({
    vid: mvlistDate.vid,
    id: mvlistDate.id,
    title: mvlistDate.title,
    pic: mvlistDate.pic,
    listenCount: mvlistDate.listenCount,
    date: mvlistDate.date,
    playUrl: `https://y.qq.com/n/yqq/mv/v/${mvlistDate.vid}.html#stat=y_new.singer.mv.mv_play`
  })
}