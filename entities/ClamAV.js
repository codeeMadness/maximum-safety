'use strict'
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require("fs");
const params = require('../utils/params');

class ClamAV {
    constructor(settings) {
        this.settings = settings;
    }

    download() {
        let path = params.LOCATION + "/" + params.CLAMAV_VERSION;
        if(fs.existsSync(path)) {
          console.log("File already exists");
          return;
        }
      
        let dl = new DownloaderHelper(params.CLAMAV_URL, params.LOCATION);
        dl.on('error', (err) => console.log('Download Failed', err));
        dl.start().catch(err => console.error(err));
        dl.on('progress', (stats) => {
          let progress = stats.progress;
          if(progress >= 100) {
            console.log("Download ClamAV completed");
          }
        });
    }

    install() {
        
    }
}

module.exports = ClamAV;