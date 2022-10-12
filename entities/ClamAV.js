'use strict'
const { params, cmd } = require('../utils/constant');
const WinOS = require('./WinOS');

class ClamAV {
    constructor(settings) {
        this.settings = settings;
        this.winos = new WinOS(params.CLAMAV_VERSION, params.CLAMAV_URL);
    }

    download() {
      this.winos.download(() => WinOS.install(cmd.CLAMAV_INSTALL));
      // this.winos.download();
      var id = setInterval(() => { 
          let progressManager = this.settings.progressManager;
          let progress = this.winos.progress;
          progressManager.updateThread('clamAV', progress);
          this.settings.window.webContents.send('progress', progressManager.toPercentage());
          if(progress >= 100) {
            clearInterval(id);
          }
      }, 3000);
    }

    getProgress() {
        this.winos.getProgress();
    }
}

module.exports = ClamAV;