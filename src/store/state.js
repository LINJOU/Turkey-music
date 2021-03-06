import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
  singer: {},
  // 播放状态
  playing: 'false',
  // 展开收起
  fullScreen: 'false',
  // 歌曲列表
  playlist: [],
  // 播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放index
  currentIndex: -1,
  // 搜索记录
  searchHistory: loadSearch(),
  // 当前播放歌曲地址
  songUrl: '',
  // 推荐歌单详情
  disc: {},
  // 排行榜详情页
  topList: {},
  // 播放记录
  playHistory: loadPlay(),
  // 收藏列表
  favoriteList: loadFavorite()
}

export default state