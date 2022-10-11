const { DownloaderHelper } = require('node-downloader-helper');
const fs = require("fs");
const {run_script, change_dir} = require('../utils/run_script');
const Logging = require('../utils/logging');
const { params } = require('../utils/constant');

class WinOS {
    constructor(version, url) {
        this.version = version;
        this.url = url;
    }

    download(window, callback = null) {
        let path = params.DISK.concat(params.SLASH, params.LOCATION, params.SLASH, this.version);
        if(fs.existsSync(path)) {
          Logging.warning("File already exists");
          return;
        }
      
        let dl = new DownloaderHelper(this.url, params.DISK.concat(params.SLASH, params.LOCATION));
        dl.on('error', (err) => Logging.error(err));
        dl.start().catch(err => Logging.error(err));
        dl.on('progress', (stats) => {
          this.progress = stats.progress;
          window.webContents.send('progress-status', this.progress);
          if(this.progress >= 100) {
            Logging.success(`Download ${this.version} completed`);
            if (typeof callback === 'function') callback();
          }
        });
    }

    static install(cmd) {
        change_dir(params.DISK.concat(params.SLASH, params.LOCATION));
        // run_script("dir", ["/A /B"]);
        run_script("start", [cmd]);
    }

}

module.exports = WinOS;