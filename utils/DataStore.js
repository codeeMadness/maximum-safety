'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor(settings) {
        super(settings);
        this.latestCleanTime = this.formatDate(new Date());
    }

    saveSecuritySettings(options) {
        this.set('schedule', options.schedule);
        this.set('realtimeDetect', options.realtimeDetect);
    }

    writeScanResult(result) {
        this.set('scanResult', result);
    }

    getScanResult() {
        this.scanResult = this.get('scanResult');
        return this;
    }

    writeCleanTime() {
        this.set('latestCleanTime', this.formatDate(new Date()));
    }

    getCleanTime() {
        this.latestCleanTime = this.get('latestCleanTime') || this.formatDate(new Date());
        return this;
    }

    formatDate(date) {
        var dateString =
            date.toDateString() + " " +
            ("0" + date.getUTCHours()).slice(-2) + ":" +
            ("0" + date.getUTCMinutes()).slice(-2) + ":" +
            ("0" + date.getUTCSeconds()).slice(-2);
        return dateString;
    }
}

module.exports = DataStore;