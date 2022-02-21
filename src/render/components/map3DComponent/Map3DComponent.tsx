import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useState } from "react";
import { createEntity, createPoint, createPosition } from "../../util/map3DUtil/createMapEntity";

function Map3DComponent() {
    const [isDraw, setIsDraw] = useState(false);

    useEffect(() => {
        let window_: any = window
        window_.CESIUM_BASE_URL = 'http://localhost:3000/';
        initCesium()
    }, [])
    return (
        <div id="cesiumcontain">
        </div>
    )

    function initCesium() {
        // 设置静态资源目录
        // buildModuleUrl.setBaseUrl('../static/Cesium/')
        // 创建viewer实例
        let viewer = new Cesium.Viewer('cesiumcontain', {
            timeline: false,
            animation: false,
            fullscreenButton: false
        })
        viewer.scene.globe.enableLighting = true
        // viewer.cesiumWidget.creditContainer.style.display = 'none'
        viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
        // 增加影像底图
        viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=b9d6abed32f12b4094773fc6985b9ea3",
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
        viewer.scene.camera.setView(position1)
        // setTimeout(() => {
        //   this.viewer.scene.camera.flyTo(position2)
        // }, 5000)
        viewer.entities.add(createEntity(117, 36, 1000, 20000, 30000, 40000))
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
        // 点击事件，
        handler.setInputAction(event => {
            // event.position为屏幕位置
            var earthPosition = viewer.camera.pickEllipsoid(
                event.position,
                viewer.scene.globe.ellipsoid
            )
            if (earthPosition) {

                let carto_position = viewer.scene.globe.ellipsoid.cartesianToCartographic(
                    earthPosition
                )
                var ray = viewer.camera.getPickRay(event.position)
                var position = viewer.scene.globe.pick(ray, viewer.scene)
                // console.log(earthPosition, position, carto_position)
                let longitude_x = Cesium.Math.toDegrees(carto_position.longitude)
                let longitude_y = Cesium.Math.toDegrees(carto_position.latitude)
                console.log(longitude_x, longitude_y)
                if (isDraw) {
                    // 根据点击的位置创建点要素，并将其添加到场景中
                    viewer.entities.add(
                        createPoint('test', longitude_x, longitude_y, 5, 'green')
                    )
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        // 场景添加鼠标移动监听事件
        viewer.scene.canvas.addEventListener('mousemove', e => {
            var ellipsoid = viewer.scene.globe.ellipsoid
            // Mouse over the globe to see the cartographic position
            var cartesian = viewer.camera.pickEllipsoid(
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
            }
        })
        let djEntity = createPoint('djxc', 120, 36, 5, 'blue')
        viewer.entities.add(djEntity)
        // this.viewer.zoomTo(djEntity)
    }
}

export default Map3DComponent