'use strict'

const { params: linux_params, cmd: linux_cmd } = require('../utils/linuxconstant');
const { params: mac_params, cmd: mac_cmd } = require('../utils/macconstant');
const { location: win_location, params : win_params, cmd: win_cmd} = require('../utils/winconstant');
const LinuxOS = require('./LinuxOS');
const MacOS = require('./MacOS');
const WinOS = require('./WinOS');
const { run_script, change_dir } = require('../utils/run_script');
const path = require('path');

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
      this.winos.download(() => WinOS.install(win_cmd.CLAMAV_INSTALL.concat(win_location.CLAMAV_INSTALL_LOCATION), () => this.config()));
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

    scan(subWindow) {
      change_dir(win_location.CLAMAV_INSTALL_LOCATION);
      run_script(win_cmd.CLAMAV_CMD, [win_cmd.CLAMAV_SCAN], {name: 'clamav', progress: true, window: subWindow}, (data) => {
          this.settings.dataStore.writeScanResult(data);
          // C:\MaximumSafety\test\infected_test.txt: Eicar-Test-Signature FOUND
          // ----------- SCAN SUMMARY -----------
          // Known viruses: 1992612
          // Engine version: 0.103.7
          // Scanned directories: 1
          // Scanned files: 1
          // Infected files: 1
          // Data scanned: 0.00 MB
          // Data read: 0.00 MB (ratio 0.00:1)   
          // Time: 8.156 sec (0 m 8 s)
          // Start Date: 2022:10:14 00:51:01
          // End Date:   2022:10:14 00:51:09

          // subWindow.webContents.send('latest-cleantime', this.settings.dataStore.getCleanTime().latestCleanTime);
      });
    }

    config() {
        change_dir(win_location.CLAMAV_INSTALL_LOCATION);
        WinOS.writeFile(win_location.CLAMAV_INSTALL_LOCATION.concat(win_params.SLASH, "freshclam.conf"), "");
        WinOS.copyFile(path.join(__dirname,'/config/freshclam.conf'), win_location.CLAMAV_INSTALL_LOCATION.concat(win_params.SLASH, "freshclam.conf"));
        run_script(win_cmd.FRESHCLAM_CMD, []);
    }
}

module.exports = ClamAV;