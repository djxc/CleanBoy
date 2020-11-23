# 学习 electron——js 构建桌面应用 vue init simulatedgreg/electron-vue my-electron

### 一、这里采用的技术栈为 electron+vue

- 1、electron 分为两种进程，主进程以及渲染进程。一个程序只有一个主进程，每个页面对应一个渲染进程。主进程可以获取系统资源，渲染进行则不可，但可以通过与主进程通信获取系统资源。
- 2、程序的主入口为 src/main/index.js
- 3、添加 element-ui，使用 yarn 安装 element-ui，在 renderer 中的 main.js 中添加 element 的引用，即可在 vue 页面中使用 element 组件。
- 4、由于使用了 eslint 进行语法检查，对双引号、空格会报错，修改根目录下的.eslintrc.js 文件，然后创建.prettierrc.json 文件设置 vscode 格式化不将单引号改变为双引号。
- 5、mapbox 加载用 gdal2tiles 生成的 xyz 文件，出现问题，没有加载成功。
- 6、项目组织有点乱，需要多看别人的优秀项目。
- 7、将 mapbox 与 echarts 相结合，可以在地图上生成柱状图、折线图等。需要安装 echarts-gl，在 echarts 中创建 mapbox，然后可以通过 echarts 获取 mapbox 实例，然后进行一些操作。
- 8、采用 mapbox-gl-draw 库，实现要素编辑。提供 create、update 以及 delete 事件，在事件回调函数中可以获取 feature 对象。
- 9、通过 turf.js 库进行空间分析，计算面积、缓冲区分析。需要输入 geojson 格式的数据，这里将 mapbox 创建的要素进行组织生成 turf.js 需要的格式。
- 10、引入 cesium 组件显示三维场景。有两种方法导入 cesium：源码导入、build 文件导入。这里采用的 build 文件导入，修改的地方较少。之前在 react 引用 cesium 属于源码导入。
- 11、采用 js 库 jimp 创建缩略图，可以使用该库对图片进行操作。
- 12、Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory。出现内存不够，需要在 package.json:添加 "build": "node --max_old_space_size=4096 .electron-vue/build.js && electron-builder",
- 13、采用 nodejs 的 request 发送请求，获取天地图或是谷歌地图切片，需要设置请求的头数据，不然服务器不能正常响应该请求。
- 14、在 electron-vue 中使用 vuex 会不能修改 state，需要使用 dispatch 方法，然后需要在主线程中引用`import '../renderer/store'`，获取实时的 state 需要在组件中引用`import { mapState } from 'vuex'`，然后

```javascript
    computed: {
        ...mapState({
        lon_x: state => state.Counter.lon_x,
        lat_y: state => state.Counter.lat_y
        })
    }
```
