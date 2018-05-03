import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 选择播放
export const selectPlay = function ({commit, state}, {list, index, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_SONGURL, url)
}

// 全部播放
export const allPlay = function ({commit}, {list, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_SONGURL, url)
}

// 搜索结果添加到播放列表
export const insertSong = function ({commit, state}, song) {
  // 歌曲列表
  let playlist = state.playlist.slice()
  // 播放列表
  let sequencelist = state.sequenceList.slice()
  // 索引
  let currentIndex = state.currentIndex
  // 记录当前的歌曲
  let currentSong = playlist[currentIndex]
  // 判断当前播放列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  // arr.splice(index,howmany,item1,.....,itemX)向/从数组中添加/删除项目，然后返回被删除的项目。 index: 必需 规定添加/删除项目的位置，使用负数可从数组结尾处规定位置 howmany: 必需 要删除的项目数量。如果设置为 0，则不会删除项目。item： 可选。向数组添加的新项目。
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      // 如果存在于当前歌曲之前
      // 删除之前的歌曲
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 如果存在于当前歌曲之后 +1 加上添加后的位置变化
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequencelist, currentSong) + 1

  let fsIndex = findIndex(sequencelist, song)

  sequencelist.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequencelist.splice(fsIndex, 1)
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索结果存到本地
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空搜索历史
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}