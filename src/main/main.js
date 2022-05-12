const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const { MQClient } = require("./service/mqtt/DMqtt")
const { DMqttManage } = require("./service/mqtt/DMqttManage");
const { parseVT } = require('./service/vectorTile/parseVectorTile');
const { sendMsg } = require('./service/socket/socketRequest');

const dev = true;
// 如果为开发模式，则GUI为url进行加载渲染
const winURL = dev ? `http://localhost:3000/`
  : `file://${__dirname}/index.html`
console.log(__dirname, winURL)//, process.env);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      contextIsolation: true
    }
  })

  if (dev) {
    win.loadURL(winURL)
  } else {
    win.loadFile('./dist/index.html')
  }
  win.setMenu(null)
  win.webContents.openDevTools()

  ipcMain.on("test_demo", (evt) => {
    console.log(evt);
  })

  MQTT(win.webContents)
  // parseVT()
  soketRequest()
}


/**
 * 通过socket发送消息
 */
function soketRequest() {
  ipcMain.on("soketRequest", (evt, args) => {
    console.log("测试socket", args);
    sendMsg(args.ip, args.port, args.msg)
  })
}

/**
 * MQTT相关
 * @param {*} win 
 */
function MQTT(webContents) {
  let mqttClientManage = new DMqttManage()
  // 建立mqtt连接
  ipcMain.on("mqttConnect", (evt, args) => {
    let mqttClient = new MQClient(webContents, mqttClientManage)
    mqttClient.connect(args.url, args.name, args.passwd)
  })
}




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
