'use strict'

const { app, ipcMain } = require('electron')
const path = require('path')
const Window = require('./utils/Window');
const DataStore = require('./utils/DataStore');
const BleachBit = require('./entities/BleachBit');
const ClamAV = require('./entities/ClamAV');
const ProgressManager = require('./utils/ProgressManager');
require('electron-reload')(__dirname);

function main() {
  
  let mainWindow = new Window({file: path.join('renderer', 'index.html')})
  let scanWindow, quarantineWindow;

  let progressManager = new ProgressManager([{name: 'bleachBit', progress: 0}, {name: 'clamAV', progress: 0}]);
  let bleachbit = new BleachBit({window: mainWindow, progressManager: progressManager, dataStore: new DataStore({name: 'bleachBit'})});
  let clamAV = new ClamAV({window: mainWindow, progressManager: progressManager, dataStore: new DataStore({name: 'clamAV'})});

  ipcMain.on('open-scan-window', () => {
      if(scanWindow) return;
      scanWindow = new Window({
          file: path.join('renderer', 'scan-window.html'),
          width: 800,
          height: 700,
          parent: mainWindow
      })


      scanWindow.once('show', () => {
          scanWindow.webContents.send('latest-cleantime', bleachbit.settings.dataStore.getCleanTime().latestCleanTime);
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

  ipcMain.handle('clean-system', () => {
      bleachbit.cleanSystem(scanWindow);
  })

  ipcMain.handle('download-clamav', () => {
      clamAV.download();
  });

  ipcMain.handle('scan-now', () => {
      clamAV.scan(scanWindow);
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