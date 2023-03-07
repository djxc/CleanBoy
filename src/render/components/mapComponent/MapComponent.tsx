import mapboxgl, { AnySourceData, RasterLayer, RasterSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";
import "./MapComponent.css";

function MapComponent() {
  useEffect(() => {
    initMap();
  }, []);

  return <div id="basicMapbox"></div>;

  function initMap() {
    // mapboxgl.accessToken =
    //   "pk.eyJ1IjoiZGp4YyIsImEiOiJjanlxdzNlbW0wNHNyM29yMzZibHczOHlpIn0.TOUXgB6IHHhnmA6RsL6pWw";
    var tdtIMG: RasterSource = {
      // 类型为栅格瓦片
      type: "raster",
      tiles: [
        "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3",
      ],
      // 分辨率
      tileSize: 256,
    };
    var tdtIMGAnno: RasterSource = {
      // 类型为栅格瓦片
      type: "raster",
      tiles: [
        "http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3",
      ],
      // 分辨率
      tileSize: 256,
    };

    let tdtSource = {
      type: "vector",
      tiles: [
        "http://tile1.tianditu.gov.cn/vts?t=vt&z={z}&x={x}&y={y}&tk=b9d6abed32f12b4094773fc6985b9ea3",
      ],
      minZoom: 0,
      maxzoom: 18,
    };

    let map = new mapboxgl.Map({
      container: "basicMapbox",
      style: {
        version: 8,
        layers: [],
        sources: {
          tdtIMG: tdtIMG,
          tdtIMGAnno: tdtIMGAnno,
        },
        sprite: "https://vector.tianditu.gov.cn/static/sprite/png",
        glyphs:
          "https://vector.tianditu.gov.cn/static/font/{fontstack}/{range}.pbf",
      },
      center: [120.517, 36.156],
      zoom: 10,
    });

    let tdtIMGLayer: RasterLayer = {
      id: "tdtIMG",
      // scheme: 'tms',
      // 图层类型
      type: "raster",
      // 数据源
      source: "tdtIMG",
      // 图层最小缩放级数
      minzoom: 0,
      // 图层最大缩放级数
      maxzoom: 20,
    };
    let tdtIMGAnnoLayer: RasterLayer = {
      // 图层id，要保证唯一性
      id: "tdtIMGAnno",
      // 图层类型
      type: "raster",
      // 数据源
      source: "tdtIMGAnno",
      // 图层最小缩放级数
      minzoom: 0,
      // 图层最大缩放级数
      maxzoom: 20,
    };

    // 使用定位模块
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: true,
        // zoom: 14
      })
    );
    // 地图点击事件
    map.on("click", (e) => {
      // let data = JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat)
      // marker.setLngLat([e.lngLat.lng,e.lngLat.lat]).addTo(map)
      // console.log(e.lngLat.lng, e.lngLat.lat)
      // new mapboxgl.Popup()
      //   .setLngLat([e.lngLat.lng, e.lngLat.lat])
      //   .setHTML('description')
      //   .addTo(this.map)
    });
    // 当map加载成功后在添加要素以及图层
    map.on("load", () => {
      map.addLayer(tdtIMGLayer);
      map.addLayer(tdtIMGAnnoLayer);

      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              // feature for Mapbox DC
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [120.03238901390978, 35.913188059745586],
              },
              properties: {
                title: "Mapbox DC",
                icon: "monument",
              },
            },
            {
              // feature for Mapbox SF
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [120.414, 35.776],
              },
              properties: {
                title: "Mapbox SF",
                icon: "harbor",
              },
            },
          ],
        },
      });

      // map.addLayer({
      //   id: "points",
      //   type: "symbol",
      //   source: "points",
      //   layout: {
      //     // get the icon name from the source's "icon" property
      //     // concatenate the name to get an icon from the style's sprite sheet
      //     "icon-image": ["concat", ["get", "icon"], "-15"],
      //     // get the title name from the source's "title" property
      //     // 'text-field': ['get', 'title'],
      //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      //     "text-offset": [0, 0.6],
      //     "text-anchor": "top",
      //   },
      // });

      // map.addSource("szbuild", {
      //   type: "vector",
      //   scheme: "tms",
      //   tiles: [
      //     "https://tile1.tianditu.gov.cn/vts?t=vt&z={z}&x={x}&y={y}&tk=b9d6abed32f12b4094773fc6985b9ea3",
      //   ],
      // });
      // map.addLayer({
      //   id: "buildinds",
      //   source: "szbuild",
      //   "source-layer": "sz_build",
      //   type: "fill-extrusion",
      //   paint: {
      //     "fill-extrusion-color": [
      //       "interpolate",
      //       ["linear"],
      //       ["get", "height"],
      //       0,
      //       "rgb(255,255,191)",
      //       75,
      //       "rgb(253,174,97)",
      //       150,
      //       "rgb(215,25,28)",
      //     ],
      //     "fill-extrusion-height": ["get", "height"],
      //     "fill-extrusion-opacity": 1,
      //   },
      // });
    });
  }
}

export default MapComponent;
