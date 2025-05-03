import { contextBridge, ipcRenderer } from 'electron'

// Safely expose a limited API to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args))
  },
  off: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.off(channel, listener)
  }
})
