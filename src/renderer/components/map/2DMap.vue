<template>
  <div class="mapcontainer" id="basicMapbox">
    <div class="map2-menu">
      <ul>
        <li>编辑</li>
      </ul>
    </div>
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as turf from '@turf/turf'
export default {
  name: 'd2map',
  data: () => {
    return {
      message: 'djxc',
      map: null,
      draw: null
    }
  },
  mounted() {
    this.initMap()
    this.createDraw()
  },
  methods: {
    initMap() {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiZGp4YyIsImEiOiJjanlxdzNlbW0wNHNyM29yMzZibHczOHlpIn0.TOUXgB6IHHhnmA6RsL6pWw'
      var tdtIMG = {
        // 类型为栅格瓦片
        type: 'raster',
        tiles: [
          'http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3'
        ],
        // 分辨率
        tileSize: 256
      }
      var tdtIMGAnno = {
        // 类型为栅格瓦片
        type: 'raster',
        tiles: [
          'http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3'
        ],
        // 分辨率
        tileSize: 256
      }

      // var tdtIMG = {
      //   // 类型为栅格瓦片
      //   type: 'raster',
      //   tiles: ['http://localhost:8090/cache/all_tif/{z}/{x}/{y}.png'],
      //   // 分辨率
      //   tileSize: 256
      // }
      this.map = new mapboxgl.Map({
        container: 'basicMapbox',
        style: {
          version: 8,
          sources: {
            tdtIMG: tdtIMG,
            tdtIMGAnno: tdtIMGAnno
          },
          layers: [
            {
              // 图层id，要保证唯一性
              id: 'tdtIMG',
              scheme: 'tms',
              // 图层类型
              type: 'raster',
              // 数据源
              source: 'tdtIMG',
              // 图层最小缩放级数
              minzoom: 0,
              // 图层最大缩放级数
              maxzoom: 20
            },
            {
              // 图层id，要保证唯一性
              id: 'tdtIMGAnno',
              // 图层类型
              type: 'raster',
              // 数据源
              source: 'tdtIMGAnno',
              // 图层最小缩放级数
              minzoom: 0,
              // 图层最大缩放级数
              maxzoom: 20
            }
          ]
        },
        center: [120.517, 36.156],
        zoom: 16
      })
      // 使用定位模块
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true,
          zoom: 14
        })
      )
      // 地图点击事件
      this.map.on('click', e => {
        // let data = JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat)
        // marker.setLngLat([e.lngLat.lng,e.lngLat.lat]).addTo(map)
        // console.log(e.lngLat.lng, e.lngLat.lat)
        // new mapboxgl.Popup()
        //   .setLngLat([e.lngLat.lng, e.lngLat.lat])
        //   .setHTML('description')
        //   .addTo(this.map)
      })
      // 当map加载成功后在添加要素以及图层
      this.map.on('load', () => {
        this.map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                // feature for Mapbox DC
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [120.03238901390978, 35.913188059745586]
                },
                properties: {
                  title: 'Mapbox DC',
                  icon: 'monument'
                }
              },
              {
                // feature for Mapbox SF
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [120.414, 35.776]
                },
                properties: {
                  title: 'Mapbox SF',
                  icon: 'harbor'
                }
              }
            ]
          }
        })
        this.map.addLayer({
          id: 'points',
          type: 'symbol',
          source: 'points',
          layout: {
            // get the icon name from the source's "icon" property
            // concatenate the name to get an icon from the style's sprite sheet
            'icon-image': ['concat', ['get', 'icon'], '-15'],
            // get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
          }
        })
      })
    },
    // 添加编辑工具栏
    createDraw() {
      this.draw = new MapboxDraw({
        displayControlsDefault: true,
        controls: {
          polygon: true,
          line_string: true,
          point: true,
          trash: true
        }
      })
      this.map.addControl(this.draw, 'top-right')
      this.map.on('draw.create', this.drawFinish)

      this.map.on('draw.delete', this.drawDelete)
      this.map.on('draw.update', this.drawUpdate)
    },
    // 要素编辑结束触发事件
    drawFinish(e) {
      let data = this.draw.getAll()
      let feature = turf.polygon([e.features[0].geometry.coordinates[0]])
      let area = turf.area(feature)
      console.log(area)

      console.log(e.features[0].geometry.coordinates[0])
      console.log(data)
    },
    // 要素修改后触发的事件
    drawUpdate(e) {},
    // 删除要素后触发的事件
    drawDelete(e) {}
  },
  computed: {}
}
</script>
<style>
@import url('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css');
@import url('https://api.mapbox.com/mapbox-gl-js/v1.8.0/mapbox-gl.css');
.mapcontainer {
  width: 100%;
  height: 100%;
  background-color: cadetblue;
}
.map2-menu {
  position: absolute;
  width: 10%;
  height: 60%;
  background-color: rgba(85, 175, 228, 0.74);
  z-index: 10;
  margin: 1vmin auto auto 1vmin;
  border-radius: 0.3em;
}
</style>