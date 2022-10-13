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
    cleanSystem: () => ipcRenderer.invoke('clean-system'),
    scanSystem: () => ipcRenderer.invoke('scan-now'),
    featureProgress: () => ipcRenderer.on('feature-progress', (e, message) => {
        if(message.name == 'bleachbit') {
            var elem = document.getElementById("clean-bar");
            elem.style.width = message.percentage + "%";
        }

        if(message.name == 'clamav') {
            var elem = document.getElementById("scan-bar");
            elem.style.width = message.percentage + "%";
        }

    })
})

contextBridge.exposeInMainWorld('infos', {
  latestCleanTime: () => ipcRenderer.on('latest-cleantime', (e, time) => {
      console.log("Latest Clean Time " + time);
      var elem = document.getElementById("clean-information");
      elem.innerHTML = `Last clean date: ${time}`;
  })
})