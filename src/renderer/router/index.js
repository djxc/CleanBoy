import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/components/mainPage/mainPage').default,
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
          path: 'charts',
          name: 'charts',
          component: require('@/components/charts/index').default
        }
      ]
    }
  ]
})
