'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import testGPS from './util/showGPS'
import CreateThumbnail from './util/createThumbnail'
const { ipcMain } = require('electron')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// 如果为开发模式，则GUI为url进行加载渲染
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 去除原生顶部菜单栏
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 主进程接收渲染进程的请求事件, 解析照片的经纬度信息，arg为照片文件夹以及GPS保存文件位置
  ipcMain.on('parse-photo-GPS', (event, arg) => {
    testGPS(arg[0], arg[1], (state) => {
      event.sender.send('parseGPS', state) // 将事件处理结果在以另一个响应返给渲染进程
    })
  })
  // 保存文件的对话框
  ipcMain.on('save-file', (event, arg) => {
    dialog.showSaveDialog(mainWindow, {
      filters: [{ name: '文本文件', extensions: ['txt'] }]
    }, (fileName, bookMark) => {
      event.sender.send('save-GPS-file', fileName) // 将事件处理结果在以另一个响应返给渲染进程
      console.log(fileName)
    })
  })

  // 创建缩略图
  ipcMain.on('create_thumbnail', (event, arg) => {
    CreateThumbnail('D:/2020/病树前头万木春/illTreeIMG/')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
