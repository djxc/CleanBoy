import { View, Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import GeoJSON from "ol/format/GeoJSON";
import { useEffect } from "react";
import XYZ from "ol/source/XYZ";
import WebGLPointsLayer from "ol/layer/WebGLPoints";

import "ol/ol.css";
import "./olMap.css";
import TileLayer from "ol/layer/Tile";

import ShipIcon from "../../asset/ship.svg";
import ShipIcon1 from "../../asset/three.jpeg";

import { Point } from "ol/geom";

function OLMap() {
  useEffect(() => {
    const vectorSource = new VectorSource<Point>({
      format: new GeoJSON(),
      url: "http://localhost:8060/geoserver/webgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis%3Aship_info&outputFormat=application%2Fjson",
    });

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: ShipIcon,
        }),
      }),
      minZoom: 10,
    });

    const vectorPoint = new VectorLayer({
      source: vectorSource,
      maxZoom: 10,
    });

    let webGLpointsLayer = new WebGLPointsLayer({
      source: vectorSource,
      style: {
        symbol: {
          symbolType: "circle",
          size: ["interpolate", ["exponential", 2.5], ["zoom"], 2, 1, 14, 32],
          color: "#240572",
          offset: [0, 0],
          opacity: 0.95,
        },
      },
    });

    // 如果要根据不同数据设置不同的图标可以采用雪碧图
    let webGLpointsLayer1 = new WebGLPointsLayer({
      source: vectorSource,
      style: {
        symbol: {
          symbolType: "image",
          src: ShipIcon,
          size: [18, 28],
          color: "lightyellow",
          rotateWithView: false,
          offset: [0, 9],
        },
      },
      minZoom: 10,
    });

    const raster = new TileLayer({
      source: new XYZ({
        crossOrigin: "anonymous",
        url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
        maxZoom: 20,
      }),
    });

    let mapDiv = document.getElementById("olmap");
    if (mapDiv) {
      const map = new Map({
        layers: [raster, vectorPoint, webGLpointsLayer1],
        target: mapDiv,
        view: new View({
          center: [120.277395891, 36.072437216],
          maxZoom: 19,
          zoom: 12,
          projection: "EPSG:4326",
        }),
      });
    }
  }, []);
  return (
    <div>
      <div id="olmap"></div>
    </div>
  );
}

export default OLMap;
