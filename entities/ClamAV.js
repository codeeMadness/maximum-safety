'use strict'

const { params: linux_params, cmd: linux_cmd } = require('../utils/linuxconstant');
const { params: mac_params, cmd: mac_cmd } = require('../utils/macconstant');
const { location: win_location, params : win_params, cmd: win_cmd } = require('../utils/winconstant');
const LinuxOS = require('./LinuxOS');
const MacOS = require('./MacOS');
const WinOS = require('./WinOS');
const { run_script, change_dir } = require('../utils/run_script');

class ClamAV {
    constructor(settings) {
        this.settings = settings;
        this.initializeOS();
    }

    initializeOS() {
      if(process.platform == 'darwin') {
          this.macos = new MacOS(mac_params.CLAMAV_VERSION, mac_params.CLAMAV_URL);
      }

      else if(process.platform == 'linux') {
          this.linuxos = new LinuxOS(linux_params.CLAMAV_VERSION, linux_params.CLAMAV_URL);
      }

      else {
          this.winos = new WinOS(win_params.CLAMAV_VERSION, win_params.CLAMAV_URL);
      }
      
    }

    download() {
      this.winos.download(() => WinOS.install(win_cmd.CLAMAV_INSTALL.concat(win_location.CLAMAV_INSTALL_LOCATION)));
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
}

module.exports = ClamAV;