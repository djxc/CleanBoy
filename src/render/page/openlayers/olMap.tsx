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


import Circle from 'ol/geom/Circle.js';
import Feature from 'ol/Feature.js';
import { Circle as CircleStyle, Fill } from 'ol/style.js';

import "ol/ol.css";
import "./olMap.css";
import TileLayer from "ol/layer/Tile";
import GeoTIFF from 'ol/source/GeoTIFF.js';

import ShipIcon from "../../asset/ship.svg";
import ShipIcon1 from "../../asset/three.jpeg";
import COGLayer from "../../util/COGLayer";

import { Point } from "ol/geom";

function OLMap() {
  useEffect(() => {
    // initMap();
    cog_demo();
  }, []);

  function initMap() {
    const raster = new TileLayer({
      source: new XYZ({
        crossOrigin: "anonymous",
        url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
        maxZoom: 20,
      }),
    });
    let mapDiv = document.getElementById("olmap");

    const image = new CircleStyle({
      radius: 5,
      stroke: new Stroke({ color: 'red', width: 1 }),
    });
    let offset = 360;
    const geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [120, -10],
              [-170 + offset, -10],
            ],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [125, 5],
              [125, -15],
            ],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [120, -15],
                [-170 + offset, -15],
                [-170 + offset, 5],
                [120, 5],
              ],
            ],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': [
              [
                [-1e6, -7.5e5],
                [-1e6, 7.5e5],
              ],
              [
                [1e6, -7.5e5],
                [1e6, 7.5e5],
              ],
              [
                [-7.5e5, -1e6],
                [7.5e5, -1e6],
              ],
              [
                [-7.5e5, 1e6],
                [7.5e5, 1e6],
              ],
            ],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [
              [
                [
                  [-5e6, 6e6],
                  [-3e6, 6e6],
                  [-3e6, 8e6],
                  [-5e6, 8e6],
                  [-5e6, 6e6],
                ],
              ],
              [
                [
                  [-2e6, 6e6],
                  [0, 6e6],
                  [0, 8e6],
                  [-2e6, 8e6],
                  [-2e6, 6e6],
                ],
              ],
              [
                [
                  [1e6, 6e6],
                  [3e6, 6e6],
                  [3e6, 8e6],
                  [1e6, 8e6],
                  [1e6, 6e6],
                ],
              ],
            ],
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'GeometryCollection',
            'geometries': [
              {
                'type': 'LineString',
                'coordinates': [
                  [-5e6, -5e6],
                  [0, -5e6],
                ],
              },
              {
                'type': 'Point',
                'coordinates': [4e6, -5e6],
              },
              {
                'type': 'Polygon',
                'coordinates': [
                  [
                    [1e6, -6e6],
                    [3e6, -6e6],
                    [2e6, -4e6],
                    [1e6, -6e6],
                  ],
                ],
              },
            ],
          },
        },
      ],
    };

    const styles: any = {
      'Point': new Style({
        image: image,
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1,
        }),
      }),
      'MultiPoint': new Style({
        image: image,
      }),
      'MultiPolygon': new Style({
        stroke: new Stroke({
          color: 'yellow',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)',
        }),
      }),
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      'GeometryCollection': new Style({
        stroke: new Stroke({
          color: 'magenta',
          width: 2,
        }),
        fill: new Fill({
          color: 'magenta',
        }),
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: 'magenta',
          }),
        }),
      }),
      'Circle': new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255,0,0,0.2)',
        }),
      }),
    };

    const styleFunction: any = function (feature: Feature) {
      if (feature) {
        let geometry = feature.getGeometry();
        let type = geometry?.getType()
        if (type) {
          return styles[type]
        }
      }
      return styles['Point'];
    };
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    console.log(vectorSource);


    vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    if (mapDiv) {
      const map = new Map({
        layers: [raster, vectorLayer],
        target: mapDiv,
        view: new View({
          maxZoom: 22,
          zoom: 3,
          center: [119, 30],
          projection: "EPSG:4326",
        })
      })
      map.on('click', function (evt) {
        console.log(evt.coordinate);
      });
      // let highlightLayer = new VectorLayer({
      //   zIndex: 9999,
      //   source: new VectorSource({
      //     features: []
      //   }),
      //   style: new Style({
      //     stroke: new Stroke({
      //       color: '#ff0000',
      //       width: 5
      //     })
      //   })
      // });
      // map.addLayer(highlightLayer);
    }
  }

  function cog_demo() {
    const tif_url = "http://localhost/3_tmp.tif" //'http://skywalker-v3.ktxztech.com:28001/rs_images/server_import_images/58_cog.tiff' //'http://172.16.101.136:9000/remote-sensing/remote.sensing.product/TCI.tif'
    const raster = new TileLayer({
      source: new XYZ({
        crossOrigin: "anonymous",
        url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
        maxZoom: 20,
      }),
    });
    let mapDiv = document.getElementById("olmap");
    let cogLayer = new COGLayer(tif_url)
    cogLayer.getBandStatis().then(() => {
      let layer = cogLayer.createLayer()
      let cogSource = layer.getSource() as GeoTIFF;
      cogSource.getView().then(result => {
        console.log(result);
        if (mapDiv) {
          const map = new Map({
            layers: [layer],
            target: mapDiv,
            // view: result,
            view: new View({
              // center: [33.54, 16.74],
              // extent: result.extent,
              // maxZoom: 22,
              // zoom: 12,
              projection: "EPSG:3857",
            }),
          });
          map.getView().fit(result.extent!, { padding: [10, 10, 10, 10] });
        }
      })
    })
  }

  function createJSONVectorLayer() {
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
  }


  return (
    <div>
      <div id="olmap">

      </div>
      <div className="olmap-toolbox"></div>
    </div>
  );
}

export default OLMap;
