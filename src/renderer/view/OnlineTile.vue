<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
// import {fromLonLat} from 'ol/proj'

import 'ol/ol.css'

export default {
  name: 'onlineTile',
  data: () => {
    return {
      map: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    /**
     * **初始化地图对象**
     */
    initMap() {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            // source: new OSM()
            source: new XYZ({
              url: 'http://localhost:3001/onlineTile/test/{z}/{x}/{-y}.png',
              tileLoadFunction: (imageTile, src) => {
                fetch(src, {
                  method: 'GET'
                })
                  .then((res) => res.text())
                  .then((data) => {
                    imageTile.getImage().src = data
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              }
            })
          })
        ],
        view: new View({
          projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 19
        })
      })
    }
  }
}
</script>

<style>
#map {
  width: 100vw;
  height: 94vh;
  background-color: beige;
}
</style>