const { ipcRenderer, contextBridge } = require('electron')

window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  contextBridge.exposeInMainWorld("electron", {
    connect: (connectConfig) => { ipcRenderer.send("mqttConnect", connectConfig) },
    addTopic: (connectConfig) => { ipcRenderer.send("mqttConnect", connectConfig) },
    handleMessage: (callback) => ipcRenderer.on('handle-message', callback),
    handleConnect: (callback) => ipcRenderer.on('handle-connect', callback),
  })
})

// const fs = require("fs")

// --------- Expose some API to Renderer-process. ---------
// contextBridge.exposeInMainWorld("fs", fs)