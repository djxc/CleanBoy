<template>
  <div id="cesiumcontain"></div>
</template>

<script>
// 导入Cesium源码中的Viewer组件，注意这里是用的Viewer组件的方式加载，而不是加载整个Cesium
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
// 我们刚才所说的如何让Cesium知道静态资源在哪里的API
import buildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
// 导入必须的样式表
// require('cesium/Source/Widgets/widgets.css')
// import Cesium from 'cesium/Cesium/'
// require('cesium/Widgets/widgets.css')

import 'cesium/Source/Widgets/widgets.css'
export default {
  name: 'threeMap',
  mounted() {
    this.initCesium()
  },
  methods: {
    initCesium() {
      // 设置静态资源目录
      buildModuleUrl.setBaseUrl('../static/Cesium/')
      // 创建viewer实例
      this.viewer = new Viewer('cesiumcontain')
      console.log('test')
      // let viewer = new Cesium.Viewer('cesiumcontain')
    }
  }
}
</script>

<style>
/* @import url('cesium/Build/Widgets/widgets.css'); */
#cesiumcontain {
  width: 100%;
  height: 100%;
  background-color: aqua;
}
</style>