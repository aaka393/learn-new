"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, ...args) => {
    electron.ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    return electron.ipcRenderer.invoke(channel, ...args);
  },
  on: (channel, listener) => {
    electron.ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  off: (channel, listener) => {
    electron.ipcRenderer.off(channel, listener);
  }
});
