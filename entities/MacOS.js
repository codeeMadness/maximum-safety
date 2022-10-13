'use strict'

class MacOS {
    constructor(version, url) {
        this.version = version;
        this.url = url;
        this.progress = 0;
    }
}

module.exports = MacOS;