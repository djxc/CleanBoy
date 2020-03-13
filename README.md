# 学习electron——js构建桌面应用vue init simulatedgreg/electron-vue my-electron
### 这里采用的技术栈为electron+vue
* 1、electron分为两种进程，主进程以及渲染进程。一个程序只有一个主进程，每个页面对应一个渲染进程。主进程可以获取系统资源，渲染进行则不可，但可以通过与主进程通信获取系统资源。
* 2、程序的主入口为src/main/index.js
* 3、添加element-ui，使用yarn安装element-ui，在renderer中的main.js中添加element的引用，即可在vue页面中使用element组件。
* 4、由于使用了eslint进行语法检查，对双引号、空格会报错，修改根目录下的.eslintrc.js文件，然后创建.prettierrc.json文件设置vscode格式化不将单引号改变为双引号。
* 5、mapbox加载用gdal2tiles生成的xyz文件，出现问题，没有加载成功。
* 6、项目组织有点乱，需要多看别人的优秀项目。
* 7、将mapbox与echarts相结合，可以在地图上生成柱状图、折线图等。需要安装echarts-gl，在echarts中创建mapbox，然后可以通过echarts获取mapbox实例，然后进行一些操作。
* 8、采用mapbox-gl-draw库，实现要素编辑。提供create、update以及delete事件，在事件回调函数中可以获取feature对象。
* 9、通过turf.js库进行空间分析，计算面积、缓冲区分析。需要输入geojson格式的数据，这里将mapbox创建的要素进行组织生成turf.js需要的格式。
* 10、引入cesium组件显示三维场景。有两种方法导入cesium：源码导入、build文件导入。这里采用的build文件导入，修改的地方较少。之前在react引用cesium属于源码导入。