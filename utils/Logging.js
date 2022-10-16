'use strict'
const { writeToFile, formatDate } = require("./common");
const { location: win_location, params : win_params} = require("./winconstant");

class Logging {
    constructor() {}

    static warning(message) {
        writeToFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [WARNING] ${message}`);
        console.log("[WARNING] " + message);
    }

    static info(message) {
        writeToFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [INFO] ${message}`);
        console.log("[INFO] " + message);
    }

    static success(message) {
        writeToFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [SUCCESS] ${message}`);
        console.log("[SUCCESS] " + message);
    }

    static error(message) {
        writeToFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [ERROR] ${message}`);
        console.log("[ERROR] occured " + message);
    }
}

module.exports = Logging;