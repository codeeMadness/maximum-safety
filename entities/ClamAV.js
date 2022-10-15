'use strict'

const { params: linux_params, cmd: linux_cmd } = require('../utils/linuxconstant');
const { params: mac_params, cmd: mac_cmd } = require('../utils/macconstant');
const { location: win_location, params : win_params, cmd: win_cmd} = require('../utils/winconstant');
const LinuxOS = require('./LinuxOS');
const MacOS = require('./MacOS');
const WinOS = require('./WinOS');
const { run_script, change_dir } = require('../utils/run_script');
const path = require('path');
const Logging = require('../utils/logging');

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
            this.settings.dataStore.processScanResult(data);
            let infectedFiles = this.settings.dataStore.getInfecteds().infecteds;
            subWindow.webContents.send('summary-scan', infectedFiles);
        });
    }

    bundleInfected(location, subWindow, parent) {
        Logging.info("Selected location " + location);
        let infectedFiles = this.settings.dataStore.getInfecteds().infecteds;
        let found = infectedFiles.find(f => f.location == location);
        if(found) {
            change_dir(win_location.CLAMAV_INSTALL_LOCATION);
            run_script(win_cmd.CLAMAV_CMD, [win_cmd.CLAMAV_DELETE.concat(found.location)], null, (data) => {
                let result = this.settings.dataStore.removeInfected(found);
                if(result) {
                    subWindow.webContents.send('summary-table', this.settings.dataStore.getInfecteds().infecteds);
                    parent.webContents.send('summary-scan', this.settings.dataStore.getInfecteds().infecteds);
                }
            })
        }
    }

    allowInfected(location, subWindow, parent) {
        Logging.info("Selected location " + location);
        let infectedFiles = this.settings.dataStore.getInfecteds().infecteds;
        let found = infectedFiles.find(f => f.location == location);
        if(found) {
            let result = this.settings.dataStore.removeInfected(found);
            if(result) {
              subWindow.webContents.send('summary-table', this.settings.dataStore.getInfecteds().infecteds);
              parent.webContents.send('summary-scan', this.settings.dataStore.getInfecteds().infecteds);
            }
        }
    }

    config() {
        change_dir(win_location.CLAMAV_INSTALL_LOCATION);
        WinOS.writeFile(win_location.CLAMAV_INSTALL_LOCATION.concat(win_params.SLASH, "freshclam.conf"), "");
        WinOS.writeFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "freshclam.log"), "----- LOGGING START -----");
        WinOS.copyFile(path.join(__dirname,'/config/freshclam-6h.conf'), win_location.CLAMAV_INSTALL_LOCATION.concat(win_params.SLASH, "freshclam.conf"));
        run_script(win_cmd.FRESHCLAM_CMD, []);
    }
}

module.exports = ClamAV;