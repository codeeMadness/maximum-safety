const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('actions', {
    openScanWindow: () => ipcRenderer.send('open-scan-window'),
    openQuarantineSummaryWindow: () => ipcRenderer.send('open-quarantine-summary-window'),
    downloadBleachbit: () => ipcRenderer.invoke('download-bleachbit'),
    downloadClamAV: () => ipcRenderer.invoke('download-clamav'),
    getProgress: () => ipcRenderer.send('progress-status', data),
})