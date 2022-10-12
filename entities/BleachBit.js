'use strict'
const { params, cmd } = require('../utils/constant');
const { run_script, change_dir } = require('../utils/run_script');
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

    cleanSystem(subWindow) {
        change_dir(params.BLEACHBIT_INSTALLATION_PATH);
        run_script(cmd.BLEACHBIT_CMD, [cmd.BLEACHBIT_CLEAN], {progress: true, window: subWindow}, () => {
            this.settings.dataStore.writeCleanTime();
            subWindow.webContents.send('latest-cleantime', this.settings.dataStore.getCleanTime().latestCleanTime);
        });
    }
}

module.exports = BleachBit;