const { ipcRenderer, contextBridge } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  contextBridge.exposeInMainWorld("electron", {
    // 发送消息
    connect: (connectConfig) => {
      ipcRenderer.send("mqttConnect", connectConfig);
    },
    addTopic: (connectConfig) => {
      ipcRenderer.send("mqttConnect", connectConfig);
    },
    socketConnect: (sendInfo) => {
      ipcRenderer.send("soketRequest", sendInfo);
    },

    // 接收主线程的消息，发给渲染线程
    handleMessage: (callback) => ipcRenderer.on("handle-message", callback),
    handleConnect: (callback) => ipcRenderer.on("handle-connect", callback),
  });
});
