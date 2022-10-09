'use strict'
const { BrowserWindow } = require('electron');
const path = require('path');

const defaultProps = {
    width: 600,
    height: 500,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    }
}

class Window extends BrowserWindow {
    constructor({file, ...windowSettings}) {
        super({...defaultProps, ...windowSettings}) 
        this.loadFile(file);
        this.once('ready-to-show', () => {
            this.show();
        })
    }
}

module.exports = Window;