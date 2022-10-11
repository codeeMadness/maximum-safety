'use strict'
const { params, cmd } = require('../utils/constant');
const WinOS = require('./WinOS');

class BleachBit{
    constructor(settings) {
        this.settings = settings;
        this.winos = new WinOS(params.BLEACHBIT_VERSION, params.BLEACHBIT_URL);
    }

    download(window) {
        // this.winos.download(() => WinOS.install(cmd.BLEACHBIT_INSTALL));
        this.winos.download(window);
    }

    getProgress() {
        return this.winos.progress;
    }
}

module.exports = BleachBit;