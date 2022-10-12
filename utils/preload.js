const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('actions', {
    openQuarantineSummaryWindow: () => ipcRenderer.send('open-quarantine-summary-window'),
    downloadBleachbit: () => ipcRenderer.invoke('download-bleachbit'),
    downloadClamAV: () => ipcRenderer.invoke('download-clamav'),
    onProgress: () => ipcRenderer.on('progress', (e, percentage) => {
      var elem = document.getElementById("activate-bar");
      elem.style.width = percentage + "%";
      if(percentage >= 100) {
          ipcRenderer.send('open-scan-window');
      }
    }),
})