'use strict'
const { params } = require('../utils/constant');
const WinOS = require('./WinOS');

class ClamAV {
    constructor(settings) {
        this.settings = settings;
        this.winos = new WinOS(params.CLAMAV_VERSION, params.CLAMAV_URL);
    }

    download() {
      this.winos.download();
    }
}

module.exports = ClamAV;