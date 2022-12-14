'use strict'
const { BrowserWindow } = require('electron');
const path = require('path');

const defaultProps = {
    width: 600,
    height: 500,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }
}

class Window extends BrowserWindow {
    constructor({file, ...windowSettings}) {
        super({...defaultProps, ...windowSettings}) 
        this.loadFile(file);
        this.once('ready-to-show', () => {
            this.show();
        })
        this.setIcon(path.join(__dirname, '/assets/icon.png'));
    }
}

module.exports = Window;
