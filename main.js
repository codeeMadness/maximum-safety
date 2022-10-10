const { app, ipcMain } = require('electron')
const path = require('path')
const Window = require('./utils/Window');
const DataStore = require('./utils/DataStore');
const BleachBit = require('./entities/BleachBit');
const ClamAV = require('./entities/ClamAV');
require('electron-reload')(__dirname);

function main() {
    let bleachbit = new BleachBit({});
    let clamAV = new ClamAV({});

    let mainWindow = new Window({file: path.join('renderer', 'index.html')})
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

    ipcMain.handle('download-bleachbit', () => {
      bleachbit.download();
    });
    ipcMain.handle('download-clamav', () => {
      clamAV.download();
    });
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