import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getter'
import state from './state'
import mutations from './mutations'

// 插件
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  // 调时插件
  plugins: debug ? [createLogger()] : []
})