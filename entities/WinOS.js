'use strict'

const { DownloaderHelper } = require('node-downloader-helper');
const fs = require("fs");
const {run_script, change_dir} = require('../utils/run_script');
const Logging = require('../utils/logging');
const { location, params } = require('../utils/winconstant');

class WinOS {
    constructor(version, url) {
        this.version = version;
        this.url = url;
        this.progress = 0;
        this.createWorkingDir();
    }

    createWorkingDir() {
      if (!fs.existsSync(location.DOWNLOAD_LOCATION)){
          fs.mkdirSync(location.DOWNLOAD_LOCATION, { recursive: true });
      }

      if (!fs.existsSync(location.INSTALL_LOCATION)){
          fs.mkdirSync(location.INSTALL_LOCATION, { recursive: true });
      }

      if (!fs.existsSync(location.TEST_LOCATION)){
          fs.mkdirSync(location.TEST_LOCATION, { recursive: true });
      }

      if (!fs.existsSync(location.LOG_LOCATION)){
          fs.mkdirSync(location.LOG_LOCATION, { recursive: true });
      }

    }

    download(install = null) {
        let path = location.DOWNLOAD_LOCATION.concat(params.SLASH, this.version)
        if(fs.existsSync(path)) {
          this.progress = 100;
          return true;
        }

        this.dl = new DownloaderHelper(this.url, location.DOWNLOAD_LOCATION);
        this.dl.start().catch(err => Logging.error(err));
        this.dl.on('progress', (stats) => {
          this.progress = stats.progress;
          if(this.progress >= 100) {
            Logging.success(`Download ${this.version} successfully`);
            if (typeof install === 'function') install();
          }
        });
    }

    static install(command, callback = null) {
        change_dir(location.DOWNLOAD_LOCATION);
        // run_script("dir", ["/A /B"]);
        // run_script("reg.exe", [cmd.DISABLE_UAC]);
        run_script("start", [command], null, callback);
    }

}

module.exports = WinOS;