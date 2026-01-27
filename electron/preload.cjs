const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onKeyEvent: (callback) => ipcRenderer.on('key-event', (e, data) => callback(data)),
  onControllerEvent: (callback) => ipcRenderer.on('controller-event', (e, data) => callback(data)),
});
