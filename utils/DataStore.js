'use strict'

const Store = require('electron-store');
const { formatDate } = require('./common');
const Logging = require('./logging');

class DataStore extends Store {
    constructor(settings) {
        super(settings);
        this.latestCleanTime = null;
        this.infecteds = [];
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
        this.set('latestCleanTime', formatDate(new Date()));
    }

    getCleanTime() {
        this.latestCleanTime = this.get('latestCleanTime') || [];
        return this;
    }

    processScanResult(data) {
        this.updateStatus('');
        data.forEach(i => {
            let fileInfo = i.split(":");
            if(fileInfo[0].length > 0) {
                let file = fileInfo[1].split("\\");
                let filename = file[file.length-1];
                let location = fileInfo[0].concat(":", fileInfo[1]);
                let found = this.infecteds.find(f => f.filename == filename);
                if(!found) {
                    let infectedJSON = {filename: filename, location: location, status: 'NEW', scanDate: formatDate(new Date())};
                    this.infecteds.push(infectedJSON);
                }
            }
        });
        this.set('infected', this.infecteds);
        Logging.info(this.infecteds);
    }

    updateStatus(status) {
        this.infecteds = this.get('infected') || [];
        this.infecteds.forEach(item => {
            item.status = status;
        });
        this.set('infected', this.infecteds);
    }

    removeInfected(file) {
        const index = this.infecteds.indexOf(file);
        if (index > -1) { 
            this.infecteds.splice(index, 1); 
            this.set('infected', this.infecteds);
            Logging.success("Success removed " + file);
            return true;
        } else {
            return false;
        }
    }

    getInfecteds() {
        this.infecteds = this.get('infected') || [];
        return this;
    }

}

module.exports = DataStore;