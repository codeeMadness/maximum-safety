'use strict'
const { params: linux_params, cmd: linux_cmd } = require('../utils/linuxconstant');
const { params: mac_params, cmd: mac_cmd } = require('../utils/macconstant');
const { params : win_params, cmd: win_cmd } = require('../utils/winconstant');
const LinuxOS = require('./LinuxOS');
const MacOS = require('./MacOS');
const WinOS = require('./WinOS');
const { run_script, change_dir } = require('../utils/run_script');

class BleachBit {
    constructor(settings) {
        this.settings = settings;
        this.initializeOS();
    }

    initializeOS() {
        if(process.platform == 'darwin') {
            this.macos = new MacOS(mac_params.BLEACHBIT_VERSION, mac_params.BLEACHBIT_URL);
        }

        else if(process.platform == 'linux') {
            this.linuxos = new LinuxOS(linux_params.BLEACHBIT_VERSION, linux_params.BLEACHBIT_URL);
        }

        else {
            this.winos = new WinOS(win_params.BLEACHBIT_VERSION, win_params.BLEACHBIT_URL);
        }
        
    }

    download() {
        this.winos.download(() => WinOS.install(win_cmd.BLEACHBIT_INSTALL));
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
        change_dir(win_params.BLEACHBIT_INSTALLATION_PATH);
        run_script(win_cmd.BLEACHBIT_CMD, [win_cmd.BLEACHBIT_CLEAN], {progress: true, window: subWindow}, () => {
            this.settings.dataStore.writeCleanTime();
            subWindow.webContents.send('latest-cleantime', this.settings.dataStore.getCleanTime().latestCleanTime);
        });
    }
}

module.exports = BleachBit;