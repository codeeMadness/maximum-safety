'use strict'
const { params: linux_params, cmd: linux_cmd } = require('../utils/linuxconstant');
const { params: mac_params, cmd: mac_cmd } = require('../utils/macconstant');
const { location: win_location, params : win_params, cmd: win_cmd } = require('../utils/winconstant');
const LinuxOS = require('./LinuxOS');
const MacOS = require('./MacOS');
const WinOS = require('./WinOS');
const { run_script, change_dir } = require('../utils/run_script');
const Logging = require('../utils/logging');

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
        this.winos.download(() => WinOS.install(win_cmd.BLEACHBIT_INSTALL.concat(win_location.BLEACHBIT_INSTALL_LOCATION), () => Logging.success(`Install ${win_params.BLEACHBIT_VERSION} successfully`)));
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
        change_dir(win_location.BLEACHBIT_INSTALL_LOCATION);
        run_script(win_cmd.BLEACHBIT_CMD, [win_cmd.BLEACHBIT_CLEAN], {name: 'bleachbit', progress: true, window: subWindow}, (data) => {
            this.settings.dataStore.writeCleanTime();
            subWindow.webContents.send('latest-cleantime', this.settings.dataStore.getCleanTime().latestCleanTime);
        });
    }
}

module.exports = BleachBit;