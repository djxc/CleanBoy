import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useState } from "react";
import {
  createEntity,
  createPoint,
  createPosition,
} from "../../util/map3DUtil/createMapEntity";

function Map3DComponent() {
  const [isDraw, setIsDraw] = useState(false);
  const [layer, setLayer] = useState<Cesium.ImageryLayer>();
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [hue, setHue] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [saturation, setSaturation] = useState(0);


  useEffect(() => {
    let window_: any = window;
    window_.CESIUM_BASE_URL = "http://localhost:3000/";
    initCesium();
  }, []);
  return (
    <div id="cesiumcontain">
      <div>
        <div>
          <span>亮&nbsp;&nbsp;&nbsp;&nbsp;度：{brightness}</span>
          <input
            type="range"
            step="0.01"
            style={{ width: "20vw" }}
            max="10"
            min="-10"
            value={brightness}
            onChange={(e) => {
              changeColor(e.target.value, "brightness");
            }}
          />
        </div>
        <div>
          <span>对比度：{contrast}</span>
          <input
            type="range"
            step="0.01"
            style={{ width: "20vw" }}
            max="10"
            min="-10"
            value={contrast}
            onChange={(e) => {
              changeColor(e.target.value, "contrast");
            }}
          />
        </div>
        <div>
          <span>色&nbsp;&nbsp;&nbsp;&nbsp;调：{hue}</span>
          <input
            type="range"
            step="0.01"
            style={{ width: "20vw" }}
            max="10"
            min="-10"
            value={hue}
            onChange={(e) => {
              changeColor(e.target.value, "hue");
            }}
          />
        </div>
        <div>
          <span>伽&nbsp;&nbsp;&nbsp;&nbsp;马：{gamma}</span>
          <input
            type="range"
            step="0.01"
            style={{ width: "20vw" }}
            max="10"
            min="-10"
            value={gamma}
            onChange={(e) => {
              changeColor(e.target.value, "gamma");
            }}
          />
        </div>      
        <span>饱和度：{saturation}</span>
          <input
            type="range"
            step="0.01"
            style={{ width: "20vw" }}
            max="10"
            min="-10"
            value={saturation}
            onChange={(e) => {
              changeColor(e.target.value, "saturation");
            }}
          />
      </div>
    </div>
  );

//   亮    度：0.17
// 对比度：1.14
// 色    调：5.49
// 伽    马：-1.94
// 饱和度：-1.73

  function initCesium() {
    // 设置静态资源目录
    // buildModuleUrl.setBaseUrl('../static/Cesium/')
    // 创建viewer实例
    let viewer = new Cesium.Viewer("cesiumcontain", {
      timeline: false,
      animation: false,
      fullscreenButton: false,
    });
    viewer.scene.globe.enableLighting = true;
    //创建一个对象，其属性值是接下来要用的参数值，这么做更多的是为了美观

    // viewer.cesiumWidget.creditContainer.style.display = 'none'
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
    // 增加影像底图
    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        // url: "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3",
        url: "https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        // url: "https://tile1.tianditu.gov.cn/vts?t=vt&z={z}&x={x}&y={y}&tk=b9d6abed32f12b4094773fc6985b9ea3",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
      })
    );
    var viewModel = {
      //图层亮度，1.0使用未修改的图像颜色。小于1.0会使图像更暗，而大于1.0会使图像更亮
      brightness: 20,
      //图层对比度，1.0使用未修改的图像颜色。小于1.0会降低对比度，大于1.0会增加对比度。
      contrast: 0,
      //图层色调，单位为弧度，0表示使用未修改的图像颜色
      hue: 0,
      //图层饱和度，1.0使用未修改的图像颜色。小于1.0会降低饱和度，大于1.0会增加饱和度。
      saturation: 0,
      //应用于该图层的伽马校正,1.0使用未修改的图像颜色。
      gamma: 2,
    };
    let layer = viewer.imageryLayers.get(0);
    setLayer(layer);

    // Cesium.knockout.track(viewModel);
    // 创建相机初始位置(经纬度+高程)和朝向
    var position1 = createPosition(
      120.998,
      36.674,
      1202631.082,
      7.107,
      -90,
      0.02
    );
    // 创建相机初始位置(经纬度+高程)和朝向
    var position2 = createPosition(120, 36, 1000, 7, -90, 0.2);
    // 设置视图
    viewer.scene.camera.setView(position1);
    // setTimeout(() => {
    //   this.viewer.scene.camera.flyTo(position2)
    // }, 5000)
    viewer.entities.add(createEntity(117, 36, 1000, 20000, 30000, 40000));
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // 点击事件，
    handler.setInputAction((event) => {
      // event.position为屏幕位置
      var earthPosition = viewer.camera.pickEllipsoid(
        event.position,
        viewer.scene.globe.ellipsoid
      );
      if (earthPosition) {
        let carto_position =
          viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
        var ray = viewer.camera.getPickRay(event.position);
        var position = viewer.scene.globe.pick(ray, viewer.scene);
        // console.log(earthPosition, position, carto_position)
        let longitude_x = Cesium.Math.toDegrees(carto_position.longitude);
        let longitude_y = Cesium.Math.toDegrees(carto_position.latitude);
        console.log(longitude_x, longitude_y);
        if (isDraw) {
          // 根据点击的位置创建点要素，并将其添加到场景中
          viewer.entities.add(
            createPoint("test", longitude_x, longitude_y, 5, "green")
          );
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 场景添加鼠标移动监听事件
    viewer.scene.canvas.addEventListener("mousemove", (e) => {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      // Mouse over the globe to see the cartographic position
      var cartesian = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian3(e.clientX, e.clientY),
        ellipsoid
      );
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(6);
        var latitudeString = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(6);
      }
    });
    let djEntity = createPoint("djxc", 120, 36, 5, "blue");
    viewer.entities.add(djEntity);
    // this.viewer.zoomTo(djEntity)
  }

  function changeColor(valueStr: string, type: string) {
    let value = parseFloat(valueStr);
    console.log(value);
    
    if (layer) {
      switch (type) {
        case "brightness":
          layer.brightness = value;
          setBrightness(value);
          break;
        case "contrast":
          layer.contrast = value;
          setContrast(value)
          break;
        case "hue":
          layer.hue = value;
          setHue(value)
          break;
        case "gamma":
          layer.gamma = value;
          setGamma(value)
          break
        case "saturation":
            layer.saturation = value
            setSaturation(value)
            // layer.nightAlpha 
            break
      }
    }
  }
}

export default Map3DComponent;
