'use strict'

const { DownloaderHelper } = require('node-downloader-helper');
const fs = require("fs");
const {run_script, change_dir} = require('../utils/run_script');
const Logging = require('../utils/logging');
const { params } = require('../utils/winconstant');

class WinOS {
    constructor(version, url) {
        this.version = version;
        this.url = url;
        this.progress = 0;
    }

    download(install = null) {
        let path = params.DISK.concat(params.SLASH, params.LOCATION, params.SLASH, this.version);
        if(fs.existsSync(path)) {
          Logging.warning("File already exists");
          this.progress = 100;
          return true;
        }

        this.dl = new DownloaderHelper(this.url, params.DISK.concat(params.SLASH, params.LOCATION));
        this.dl.on('error', (err) => Logging.error(err));
        this.dl.start().catch(err => Logging.error(err));
        this.dl.on('progress', (stats) => {
          this.progress = stats.progress;
          if(this.progress >= 100) {
            Logging.success(`Download ${this.version} completed`);
            if (typeof install === 'function') install();
          }
        });
    }

    static install(command) {
        change_dir(params.DISK.concat(params.SLASH, params.LOCATION));
        // run_script("dir", ["/A /B"]);
        // run_script("reg.exe", [cmd.DISABLE_UAC]);
        run_script("start", [command]);
    }

}

module.exports = WinOS;