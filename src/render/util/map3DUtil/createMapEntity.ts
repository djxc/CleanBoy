/**
 * **cesium创建三维几何体**
 */

 import * as Cesium from 'cesium'

 /**
  * **创建位置**  
  * 需要输入点的坐标以及高程信息，还需要提供相机的角度信息
  * @param lng 经度
  * @param lat 纬度
  * @param alt 高程
  * @param heading 偏航
  * @param pitch 倾斜角度
  * @param roll 翻滚角度
  */
 function createPosition(lng: number, lat: number, alt: number,
     heading: number, pitch: number, roll: number) {
     // 创建相机初始位置(经纬度+高程)和朝向
     var initialPosition = Cesium.Cartesian3.fromDegrees(
         lng, lat, alt
     )
     var initialOrientation = Cesium.HeadingPitchRoll.fromDegrees(
         heading, pitch, roll
     )
     var homeCameraView = {
         destination: initialPosition,
         orientation: {
             heading: initialOrientation.heading,
             pitch: initialOrientation.pitch,
             roll: initialOrientation.roll
         }
     }
     return homeCameraView
 }
 
 
 function createEntity(lng: number, lat: number, alt: number,
     length: number, width: number, heigth: number) {
     var entity = new Cesium.Entity({
         name: 'Red box with black outline',
         position: Cesium.Cartesian3.fromDegrees(lng, lat, alt),
         box: {
             dimensions: new Cesium.Cartesian3(length, width, heigth),
             material: Cesium.Color.RED.withAlpha(0.5),
             outline: true,
             outlineColor: Cesium.Color.BLACK
         }
     })
     return entity
 }
 
 /**
  * **创建点要素**
  * @param name 名称
  * @param lat 纬度
  * @param lon 经度
  * @param size 大小
  * @param color 颜色
  */
 function createPoint(name: string, lat: number, lon: number,
     size: number, color: string) {
     let newPoint = new Cesium.Entity({
         name: name,
         position: Cesium.Cartesian3.fromDegrees(lat, lon),
         point: {
             pixelSize: 5,
             color: Cesium.Color.RED,
             outlineColor: Cesium.Color.WHITE,
             outlineWidth: 2
         },
         label: {
             text: name,
             font: '14pt monospace',
             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
             outlineWidth: 2,
             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
             pixelOffset: new Cesium.Cartesian2(0, -9)
         }
     })
     return newPoint;
 }
 
 
 export { createPosition, createEntity, createPoint }
 