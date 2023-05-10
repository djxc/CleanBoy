# 学习 electron——js 构建桌面应用 vue init simulatedgreg/electron-vue my-electron 

## 启动运行
- 1、首先安装依赖，yarn
- 2、运行渲染进行`yarn run start_fnd`
- 3、运行主进程`yarn run start`

## 利用web技术构建桌面程序 2022-02-20
- 1、创建项目，`yarn init`,安装electron
- 2、electron分为两个进程，node后台进程，以及渲染进程，两个进程相互独立。node进程利用`electron .`启动，渲染进程这里采用vite+react，
- 3、将渲染进程进行打包后，主进程访问打包之后的文件index.html,会出现空白页面，因此需要将react路由改为HashRouter
- 4、渲染进程打包之后访问不到静态资源，需要修改vite.config.ts添加`base:"./"`即可。
- 5、程序打包，这里采用了electron-packager依赖，执行`electron-packager ./ appname ./ --platform=win32`即可


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

# 主进程与渲染进程之间的通信
- 1、这里采用contextBridge进行主进程与渲染进程之间的连接，会更安全。
- 2、采用contextBridge时可以设置contextIsolation为true，主进程与渲染进程之间的联系利用preload.js文件进行关联。
- 3、在主进程main.js文件中加载preload.js文件，然后利用ipcMain监听定义的事件。
- 4、在preload.js文件中引入contextBridge,然后利用exposeInMainWorld函数暴露出api接口，在函数中调用ipcRender.send调用主进程中的函数。
```js
    contextBridge.exposeInMainWorld("myAPI", {
    doAThing: () => {ipcRenderer.send("test_demo")}
  })
```

## ts中引用js文件
- 1、在js文件中需要export出需要的函数或对象
- 2、在js目录下创建同名.d.ts文件，内容为
```js
declare var xxx: any;
export default xxx;
```
- 3、在ts中引用js文件名，使用为xxx.yyy


## WebGPU使用
- 1、在electron中使用webGPU需要在启动命令中添加变量`--enable-unsafe-webgpu`