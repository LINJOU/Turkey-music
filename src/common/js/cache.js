// 缓存localstorage
import storage from 'good-storage'

// 定义key
const SEARCH_KEY = '_search_'
// 定义最大储存长度(确保为最新的历史记录)
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '_play_'
const PLAY_KEY_LENGTH = 200

const FAVORITE_KEY = '_favorite_'
const FAVORITE_MAX_LENGTH = 200

function insertArray (arr, val, compare, maxLen) {
  // findIndex()方法返回数组中满足比较器函数的第一个元素的索引
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // 将删除arr的最后一个元素，把数组长度减 1，并且返回它删除的元素的值。如果数组已经为空，则 pop() 不改变数组，并返回 undefined 值。
    arr.pop()
  }
}

// 删除工具函数
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, item => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 本地缓存读取搜索历史
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 删除本地搜索历史
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空搜索历史/缓存
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 缓存最近播放历史
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, item => {
    return item.id === song.id
  }, PLAY_KEY_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取最近播放历史
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 保存到收藏列表
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, item => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 从收藏列表移除
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 加载读取列表
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}