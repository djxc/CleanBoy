<template>
  <div id="cesiumcontain"></div>
</template>

<script>
/* eslint-disable */
// 使用eslint-disable将代码包围起来即可忽略eslint规则检查
// 导入Cesium源码中的Viewer组件，注意这里是用的Viewer组件的方式加载，而不是加载整个Cesium
// 这样在开发阶段可以使用，但是当打包之后就找不到cesium很多东西，显示不出地球。应该是打包之后路径就变了
// import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
// import buildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
import * as Cesium from 'cesium/Cesium'
import { createPosition, createEntity } from '../../util/3dMap/createEntity.ts'
// import 'cesium/Source/Widgets/widgets.css'
require('cesium/Widgets/widgets.css')
export default {
  name: 'threeMap',
  mounted() {
    // let cssUlr = ''
    // let jsUrl = ''
    // if (process.env.NODE_ENV === 'production ') {
    //   console.log('production', __static)
    //   cssUlr = __static + '/Cesium/Widgets/widgets.css'
    //   jsUrl = __static + '/Cesium/Cesium.js'
    // } else {
    //   console.log('dev', __static)
    //   cssUlr = 'static/Cesium/Widgets/widgets.css'
    //   jsUrl = 'static/Cesium/Cesium.js'
    // }

    // const head = document.getElementsByTagName('head')[0]
    // const link = document.createElement('link')
    // link.type = 'text/css'
    // link.rel = 'stylesheet'
    // link.href = cssUlr
    // head.appendChild(link)

    // const script = document.createElement('script')
    // script.src = jsUrl
    // head.appendChild(script)
    this.initCesium()
  },
  methods: {
    initCesium() {
      // 设置静态资源目录
      // buildModuleUrl.setBaseUrl('../static/Cesium/')
      // 创建viewer实例
      this.viewer = new Cesium.Viewer('cesiumcontain', {
        timeline: false,
        animation: false,
        fullscreenButton: false
      })
      this.viewer.scene.globe.enableLighting = true
      this.viewer._cesiumWidget._creditContainer.style.display = 'none'
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0))
      // 增加谷歌影像底图
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
          tilingScheme: new Cesium.WebMercatorTilingScheme()
        })
      )
      // 创建相机初始位置(经纬度+高程)和朝向
      var position1 = createPosition(
        120.998,
        36.674,
        1202631.082,
        7.107,
        -90,
        0.02
      )
      // 创建相机初始位置(经纬度+高程)和朝向
      var position2 = createPosition(120, 36, 1000, 7, -90, 0.2)
      // 设置视图
      this.viewer.scene.camera.setView(position1)
      setTimeout(() => {
        this.viewer.scene.camera.flyTo(position2)
      }, 5000)
      this.viewer.entities.add(createEntity(117, 36, 1000, 20000, 30000, 40000))
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
      //todo：在椭球下点击创建点
      handler.setInputAction(event => {
        // event.position为屏幕位置
        var earthPosition = this.viewer.camera.pickEllipsoid(
          event.position,
          this.viewer.scene.globe.ellipsoid
        )
        let carto_position = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          earthPosition
        )
        var ray = this.viewer.camera.getPickRay(event.position)
        var position = this.viewer.scene.globe.pick(ray, this.viewer.scene)
        console.log(earthPosition, position, carto_position)
        let longitude_x = Cesium.Math.toDegrees(carto_position.longitude)
        let longitude_y = Cesium.Math.toDegrees(carto_position.latitude)
        console.log(longitude_x, longitude_y)
        // if (Cesium.defined(earthPosition)) {
        //   createPoint(earthPosition) //在点击位置添加一个点
        // }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      this.viewer.scene.canvas.addEventListener('mousemove', e => {
        var ellipsoid = this.viewer.scene.globe.ellipsoid
        // Mouse over the globe to see the cartographic position
        var cartesian = this.viewer.camera.pickEllipsoid(
          new Cesium.Cartesian3(e.clientX, e.clientY),
          ellipsoid
        )
        if (cartesian) {
          var cartographic = ellipsoid.cartesianToCartographic(cartesian)
          var longitudeString = Cesium.Math.toDegrees(
            cartographic.longitude
          ).toFixed(6)
          var latitudeString = Cesium.Math.toDegrees(
            cartographic.latitude
          ).toFixed(6)
          console.log(longitudeString, latitudeString)
          // document.getElementById("oneMap3_latlon").innerHTML = '(' + longitudeString + ', ' + latitudeString + ')'
        }
      })
    }
  }
}
/* eslint-disable */
</script>

<style>
#cesiumcontain {
  width: 100%;
  height: 100%;
  background-color: aqua;
}
</style>