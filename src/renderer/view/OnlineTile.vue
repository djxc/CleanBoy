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
                            url: 'http://localhost:3001/onlineTile/test/{z}/{x}/{-y}.png'
                        })
                    })
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [120, 36],
                    zoom: 12
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