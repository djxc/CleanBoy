<template>
  <div id="cesiumcontain">
    <div class="left-menu">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="rgba(0, 0, 0, 0.6)"
        :collapse="openMenu"
      >
        <el-menu-item
          index="5"
          @click="closeMenu"
        >
          <i class="el-icon-s-fold"></i>
          <span slot="title">折叠</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>编辑</span>
          </template>
          <el-menu-item-group>
            <template slot="title">要素</template>
            <el-menu-item
              index="1-1"
              @click="startDraw"
            >{{this.isDraw?"取消创建点":"创建点"}}</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item
          index="3"
          disabled
        >
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// 使用eslint-disable将代码包围起来即可忽略eslint规则检查
import * as Cesium from 'cesium/Cesium'
import {
  createPosition,
  createEntity,
  createPoint
} from '../../util/3dMap/createEntity.ts'
require('cesium/Widgets/widgets.css')
export default {
  name: 'threeMap',
  mounted() {
    this.initCesium()
  },
  data: () => {
    return {
      isDraw: false,
      openMenu: false
    }
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
      // setTimeout(() => {
      //   this.viewer.scene.camera.flyTo(position2)
      // }, 5000)
      this.viewer.entities.add(createEntity(117, 36, 1000, 20000, 30000, 40000))
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
      // 点击事件，
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
        // console.log(earthPosition, position, carto_position)
        let longitude_x = Cesium.Math.toDegrees(carto_position.longitude)
        let longitude_y = Cesium.Math.toDegrees(carto_position.latitude)
        console.log(longitude_x, longitude_y)
        if (this.isDraw) {
          // 根据点击的位置创建点要素，并将其添加到场景中
          this.viewer.entities.add(
            createPoint('test', longitude_x, longitude_y, 5, 'green')
          )
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 场景添加鼠标移动监听事件
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
          // console.log(longitudeString, latitudeString)
          this.$store.dispatch('CHANGE_LON_X', longitudeString)
          this.$store.dispatch('CHANGE_LAT_Y', latitudeString)
        }
      })
      let djEntity = createPoint('djxc', 120, 36, 5, 'blue')
      this.viewer.entities.add(djEntity)
      // this.viewer.zoomTo(djEntity)
    },
    // 开始或停止编辑
    startDraw() {
      this.isDraw = !this.isDraw
    },
    closeMenu() {
      this.openMenu = !this.openMenu
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
.left-menu {
  position: absolute;
  width: 15vw;
  height: auto;
  z-index: 2;
  border-radius: 0, 0, 0.2, 0;
}

.el-menu-vertical-demo {
  height: 65vh;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>