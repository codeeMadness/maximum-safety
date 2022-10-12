'use strict'
const { params, cmd } = require('../utils/constant');
const WinOS = require('./WinOS');

class BleachBit{
    constructor(settings) {
        this.settings = settings;
        this.winos = new WinOS(params.BLEACHBIT_VERSION, params.BLEACHBIT_URL);
    }

    download() {
        this.winos.download(() => WinOS.install(cmd.BLEACHBIT_INSTALL));
        // this.winos.download();
        var id = setInterval(() => {
            let progressManager = this.settings.progressManager;
            let progress = this.winos.progress;
            progressManager.updateThread('bleachBit', progress);
            this.settings.window.webContents.send('progress', progressManager.toPercentage());
            if(progress >= 100) {
              clearInterval(id);
            }
        }, 3000);
    }
}

module.exports = BleachBit;