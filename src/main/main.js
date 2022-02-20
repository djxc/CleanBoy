const path = require('path')
const { app, BrowserWindow } = require('electron')
const dev = true;
// 如果为开发模式，则GUI为url进行加载渲染
const winURL = dev  ? `http://localhost:3000/`
  : `file://${__dirname}/index.html`
console.log(__dirname, winURL, process.env);
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // preload: path.join(__dirname, 'preload.js')
        nodeIntegration: true
      }
    })
  
    // win.loadFile('./dist/index.html')
    win.setMenu(null)
    win.loadURL(winURL)
    win.webContents.openDevTools()
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
