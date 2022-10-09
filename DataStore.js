'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor(settings) {
        super(settings)
    }

    saveSecuritySettings(options) {
        this.set('schedule', options.schedule);
        this.set('realtimeDetect', options.realtimeDetect);
    }

    writeLogCleanTime() {
        this.set('lastCleanTime', new Date().toDateString());
    }
}

module.exports = DataStore;