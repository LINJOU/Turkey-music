import Vue from 'vue'
import Router from 'vue-router'

import UserCenter from '@/components/user-center/user-center'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Search from '@/components/search/search'
import Rank from '@/components/rank/rank'
import SingerDetail from '@/components/singer-detail/singer-detail'
import MvList from '@/components/mv-list/mv-list'
import Album from '@/components/album/album'
import SingerDesc from '@/components/singer-desc/singer-desc'
import MusicList from '@/components/music-list/music-list'
import AlbumDesc from '@/components/album-desc/album-desc'
import TopList from '@/components/topList/topList'
import Disc from '@/components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/userCenter',
      component: UserCenter
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
          children: [
            {
              path: 'musicList',
              component: MusicList
            },
            {
              path: 'album',
              component: Album,
              children: [
                {
                  path: 'albumDesc',
                  component: AlbumDesc
                }
              ]
            },
            {
              path: 'mvList',
              component: MvList
            },
            {
              path: 'desc',
              component: SingerDesc
            }
          ]
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail,
          children: [
            {
              path: 'musicList',
              component: MusicList
            },
            {
              path: 'album',
              component: Album,
              children: [
                {
                  path: 'albumDesc',
                  component: AlbumDesc
                }
              ]
            },
            {
              path: 'mvList',
              component: MvList
            },
            {
              path: 'desc',
              component: SingerDesc
            }
          ]
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})
