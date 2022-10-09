const { app, ipcMain } = require('electron')
const path = require('path')
const Window = require('./Window');
const DataStore = require('./DataStore');
require('electron-reload')(__dirname);

function main() {
    let mainWindow = new Window({file: 'index.html'})
    let scanWindow, quarantineWindow;
    ipcMain.on('open-scan-window', () => {
        if(scanWindow) return;
        scanWindow = new Window({
            file: path.join('renderer', 'scan-window.html'),
            width: 800,
            height: 700,
            parent: mainWindow
        })
    })

    ipcMain.on('open-quarantine-summary-window', () => {
        if(quarantineWindow) return;
        quarantineWindow = new Window({
          file: path.join('renderer', 'quarantine-summary-window.html'),
          width: 800,
          height: 700,
          parent: scanWindow
        })
    })
}

app.whenReady().then(() => {
  main();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) main();
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})