import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 初始化界面
    {
      path: '/',
      name: 'landing-page',
      component: require('@/view/LandingPage').default
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/view/mainPage').default,
      children: [
        {
          path: '/',
          name: 'main-menu',
          component: require('@/components/mainPage/mainMenu').default
        },
        {
          path: '2dmap',
          name: '2d-map',
          component: require('@/components/map/2DMap').default
        },
        {
          path: '3dmap',
          name: '3d-map',
          component: require('@/components/threeMap/index').default
        },
        {
          path: 'charts',
          name: 'charts',
          component: require('@/components/charts/index').default
        },
        {
          path: 'dxmap',
          name: 'dxmap',
          component: require('@/components/DXMap/index').default
        },
        {
          path: 'dthree',
          name: 'dthree',
          component: require('@/components/DThree/DThree').default
        },
        {
          path: 'dwebgl',
          name: 'dwebgl',
          component: require('@/view/DJWebGL').default
        },
        {
          path: 'dwebassembly',
          name: 'dwebassembly',
          component: require('@/view/DWebAssembly').default
        },
        {
          path: 'onlineTile',
          name: 'onlineTile',
          component: require('@/view/OnlineTile').default
        }
      ]
    }
  ]
})
